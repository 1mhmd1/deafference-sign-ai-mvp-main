// Browser-side camera-permission persistence service.
// Kept in src/lib so the @/lib import alias resolves inside the Next app.

import { getOrCreateUserId } from "@/lib/identity"

export type CameraPermissionStatus = "granted" | "denied" | "prompted"

export interface CameraPermissionRecord {
  id: number
  userId: number
  status: CameraPermissionStatus
  createdAt: string
  updatedAt: string
}

interface ApiSuccess<T> { success: true; data: T }
interface ApiFailure { success: false; error: { code: string; message: string } }
type ApiResponse<T> = ApiSuccess<T> | ApiFailure

interface UserRecord { id: number }

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000").replace(/\/+$/, "")
const DEMO_USER_ID_STORAGE_KEY = "deafference:cameraPermissionUserId"
const BACKEND_DOWN_STORAGE_KEY = "deafference:cameraPermissionBackendDown"

/** Thrown instead of hitting the network once the API server is known to be unreachable this session. */
export class BackendUnavailableError extends Error {
  constructor() {
    super(`Camera-permission API at ${API_BASE_URL} is unreachable; skipping persistence for this session.`)
    this.name = "BackendUnavailableError"
  }
}

let backendDown = false

function isBackendDown(): boolean {
  if (backendDown) return true
  try {
    backendDown = window.sessionStorage.getItem(BACKEND_DOWN_STORAGE_KEY) === "1"
  } catch {}
  return backendDown
}

// fetch() only rejects on network failure (server not running, CORS, offline), never on HTTP errors.
// Remember that once so the camera view stops retrying and flooding the console with connection errors.
async function apiFetch(path: string, init: RequestInit): Promise<Response> {
  if (isBackendDown()) throw new BackendUnavailableError()
  try {
    return await fetch(`${API_BASE_URL}${path}`, init)
  } catch {
    backendDown = true
    try {
      window.sessionStorage.setItem(BACKEND_DOWN_STORAGE_KEY, "1")
    } catch {}
    throw new BackendUnavailableError()
  }
}

function withIdentityHeaders(headers: Record<string, string> = {}): Record<string, string> {
  return { ...headers, "X-User-Id": getOrCreateUserId() }
}

function generateAnonId(): string {
  return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

async function parseApiResponse<T>(res: Response): Promise<ApiResponse<T>> {
  const body = (await res.json().catch(() => null)) as ApiResponse<T> | null
  return body ?? { success: false, error: { code: "PARSE_ERROR", message: `Unreadable response (HTTP ${res.status}).` } }
}

async function getOrCreateDemoUserId(): Promise<number> {
  if (typeof window === "undefined") throw new Error("Camera permissions can only be loaded in the browser.")

  const cached = Number(window.localStorage.getItem(DEMO_USER_ID_STORAGE_KEY))
  if (Number.isInteger(cached) && cached > 0) return cached

  const response = await apiFetch("/api/users", {
    method: "POST",
    headers: withIdentityHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ email: `anon-${generateAnonId()}@deafference.local` }),
  })
  const body = await parseApiResponse<UserRecord>(response)
  if (!body.success) throw new Error(`Failed to create demo user: ${body.error.code} ${body.error.message}`)

  window.localStorage.setItem(DEMO_USER_ID_STORAGE_KEY, String(body.data.id))
  return body.data.id
}

export async function fetchCameraPermission(userId: number): Promise<CameraPermissionRecord | null> {
  const response = await apiFetch(`/api/users/camera-permission/${userId}`, {
    headers: withIdentityHeaders({ "Content-Type": "application/json" }),
  })
  if (response.status === 404) return null

  const body = await parseApiResponse<CameraPermissionRecord>(response)
  if (!body.success) throw new Error(`Failed to fetch camera permission: ${body.error.code} ${body.error.message}`)
  return body.data
}

export async function updateCameraPermission(userId: number, status: CameraPermissionStatus): Promise<CameraPermissionRecord> {
  const response = await apiFetch("/api/users/camera-permission", {
    method: "POST",
    headers: withIdentityHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ userId, status }),
  })
  const body = await parseApiResponse<CameraPermissionRecord>(response)
  if (!body.success) throw new Error(`Failed to update camera permission: ${body.error.code} ${body.error.message}`)
  return body.data
}

export async function loadPersistedCameraPermission(): Promise<{ userId: number; permission: CameraPermissionRecord | null }> {
  const userId = await getOrCreateDemoUserId()
  return { userId, permission: await fetchCameraPermission(userId) }
}
