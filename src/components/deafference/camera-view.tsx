"use client"

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, Bug, FlipHorizontal2, Hand, Loader2, RotateCcw, ShieldAlert, Video, VideoOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useI18n } from "@/i18n/use-i18n"
import { loadPersistedCameraPermission, updateCameraPermission } from "@/lib/camera-permission-service"
import { useCameraPreferences } from "./camera-preferences"
import { LandmarkOverlay, type TrackingInfo } from "./landmark-overlay"

export type CameraStatus = "loading" | "streaming" | "denied" | "unsupported" | "error" | "no-devices" | "simulation"

export interface CameraViewProps {
  /** Fires whenever the camera lifecycle state changes (drives the status card). */
  onStateChange?: (status: CameraStatus) => void
  /** Rendered under the video, inside the same card (e.g. the camera controls). */
  footer?: React.ReactNode
}

export interface CameraViewHandle {
  /** Re-requests camera access, same as clicking the in-card "Try Again" button. */
  restart: () => void
}

const LOG_PREFIX = "[CameraView]"

// Some headless/fake-device environments never resolve (or reject) the
// getUserMedia promise. This bounds how long we wait before dropping into a
// friendly simulation fallback instead of hanging on "Requesting camera
// access..." forever.
const REQUEST_TIMEOUT_MS = 6000

const IS_DEV = process.env.NODE_ENV !== "production"

export const CameraView = forwardRef<CameraViewHandle, CameraViewProps>(function CameraView(
  { onStateChange, footer },
  ref,
) {
  const { t } = useI18n()
  const copy = t.app.camera
  const [prefs] = useCameraPreferences()
  const preferredDeviceId = prefs.preferredDeviceId
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const settledRef = useRef(false)
  // Backend sync: resolved once (demo userId, since there's no auth yet) and
  // reused across retries; the initial-GET short-circuit below only runs once.
  const userIdRef = useRef<number | null>(null)
  const initialSyncRef = useRef(false)

  const [status, setStatus] = useState<CameraStatus>("loading")
  const [retryToken, setRetryToken] = useState(0)
  const [resolution, setResolution] = useState<{ width: number; height: number } | null>(null)
  const [errorInfo, setErrorInfo] = useState<{ name: string; message: string } | null>(null)
  const [debugOpen, setDebugOpen] = useState(false)
  const [tracking, setTracking] = useState<TrackingInfo | null>(null)
  const onStateChangeRef = useRef(onStateChange)
  useEffect(() => {
    onStateChangeRef.current = onStateChange
  }, [onStateChange])

  useEffect(() => {
    onStateChangeRef.current?.(status)
  }, [status])

  useEffect(() => {
    let cancelled = false
    settledRef.current = false
    setErrorInfo(null)
    setResolution(null)

    // Persists a granted/denied transition to the backend. Fire-and-forget:
    // network/backend failures must never block or crash the local stream.
    async function persistStatus(next: "granted" | "denied") {
      try {
        const userId = userIdRef.current ?? (await loadPersistedCameraPermission()).userId
        userIdRef.current = userId
        await updateCameraPermission(userId, next)
        console.log(`${LOG_PREFIX} Persisted camera permission status "${next}" for user ${userId}.`)
      } catch (err) {
        console.warn(`${LOG_PREFIX} Failed to persist camera permission status "${next}" to the backend.`, err)
      }
    }

    async function attach() {
      // Arm the stuck-request watchdog for the whole lifecycle up front,
      // since enumerateDevices() and getUserMedia() can both hang
      // indefinitely in some camera-less/headless environments.
      timeoutRef.current = setTimeout(() => {
        if (!settledRef.current && !cancelled) {
          console.warn(
            `${LOG_PREFIX} Camera lifecycle did not settle within ${REQUEST_TIMEOUT_MS}ms. Falling back to Camera Simulation Mode.`,
          )
          settledRef.current = true
          setStatus("simulation")
        }
      }, REQUEST_TIMEOUT_MS)

      // ---- Phase 1: check device support ----
      setStatus("loading")
      console.log(`${LOG_PREFIX} Phase 1: checking device support…`)

      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        console.error(`${LOG_PREFIX} Phase 1 FAILED: navigator.mediaDevices.getUserMedia is unavailable in this browser.`)
        settledRef.current = true
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        if (!cancelled) setStatus("unsupported")
        return
      }

      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoInputs = devices.filter((d) => d.kind === "videoinput")
        console.log(
          `${LOG_PREFIX} Phase 1 result: ${devices.length} device(s) found, ${videoInputs.length} video input(s).`,
          devices,
        )

        if (videoInputs.length === 0) {
          console.warn(`${LOG_PREFIX} Phase 1: no video input devices detected.`)
          settledRef.current = true
          if (timeoutRef.current) clearTimeout(timeoutRef.current)
          if (!cancelled) setStatus("no-devices")
          return
        }
      } catch (err) {
        console.warn(`${LOG_PREFIX} Phase 1: enumerateDevices() failed, attempting getUserMedia anyway.`, err)
      }

      if (settledRef.current) return // watchdog already fired while Phase 1 was hanging

      // ---- Phase 2: call getUserMedia ----
      // `ideal` (not `exact`) so a stale/unplugged preferred device falls back to the default camera instead of failing.
      const constraints: MediaStreamConstraints = {
        video: preferredDeviceId ? { deviceId: { ideal: preferredDeviceId } } : { facingMode: "user" },
        audio: false,
      }
      console.log(`${LOG_PREFIX} Phase 2: calling getUserMedia() with constraints:`, constraints)

      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        settledRef.current = true
        if (timeoutRef.current) clearTimeout(timeoutRef.current)

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }

        // ---- Phase 3: resolution of the stream ----
        streamRef.current = stream
        const tracks = stream.getVideoTracks()
        console.log(`${LOG_PREFIX} Phase 3: stream resolved. active=${stream.active}, track count=${tracks.length}`)
        tracks.forEach((track) => {
          const settings = track.getSettings()
          console.log(
            `${LOG_PREFIX} Phase 3 track detail: label="${track.label || "unlabeled"}" readyState=${track.readyState} enabled=${track.enabled} width=${settings.width} height=${settings.height}`,
          )
        })

        // ---- Phase 4: attach stream to <video> ----
        if (videoRef.current) {
          const video = videoRef.current
          video.srcObject = stream
          console.log(`${LOG_PREFIX} Phase 4: srcObject attached, waiting for onLoadedMetadata…`)
          video.onloadedmetadata = () => {
            console.log(
              `${LOG_PREFIX} Phase 4: onLoadedMetadata fired. videoWidth=${video.videoWidth} videoHeight=${video.videoHeight}`,
            )
            setResolution({ width: video.videoWidth, height: video.videoHeight })
          }
        } else {
          console.error(`${LOG_PREFIX} Phase 4 FAILED: <video> ref is not mounted, cannot attach stream.`)
        }
        setStatus("streaming")
        void persistStatus("granted")
      } catch (err: unknown) {
        settledRef.current = true
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        if (cancelled) return

        const name = err instanceof DOMException ? err.name : "UnknownError"
        const message = err instanceof DOMException ? err.message : String(err)
        console.error(`${LOG_PREFIX} Phase 2 FAILED: getUserMedia() rejected — ${name}: ${message}`, err)
        setErrorInfo({ name, message })
        const isDenied = name === "NotAllowedError" || name === "PermissionDeniedError"
        setStatus(isDenied ? "denied" : "error")
        if (isDenied) void persistStatus("denied")
      }
    }

    async function run() {
      // Only on the very first mount (not on user-triggered retries): check
      // the backend for a previously persisted decision before touching
      // getUserMedia, so a hard refresh reflects "denied" immediately
      // instead of flashing "Requesting camera access…" first.
      if (!initialSyncRef.current) {
        initialSyncRef.current = true
        try {
          const { userId, permission } = await loadPersistedCameraPermission()
          userIdRef.current = userId
          console.log(`${LOG_PREFIX} Restored persisted camera permission from backend:`, permission)
          if (!cancelled && permission?.status === "denied") {
            settledRef.current = true
            setStatus("denied")
            return
          }
        } catch (err) {
          console.warn(`${LOG_PREFIX} Failed to load persisted camera permission; continuing with live check.`, err)
        }
      }
      if (cancelled) return
      await attach()
    }

    run()

    return () => {
      cancelled = true
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      streamRef.current?.getTracks().forEach((track) => {
        track.stop()
        console.log(`${LOG_PREFIX} Stopped track: ${track.kind}/${track.label || "unlabeled"}`)
      })
      streamRef.current = null
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }
  }, [retryToken, preferredDeviceId])

  const handleRetry = useCallback(() => {
    console.log(`${LOG_PREFIX} Retry requested by user.`)
    setRetryToken((t) => t + 1)
  }, [])

  useImperativeHandle(ref, () => ({ restart: handleRetry }), [handleRetry])

  const statusCopy: Record<
    Exclude<CameraStatus, "streaming">,
    { icon: React.ReactNode; title: string; desc: string; retry: boolean }
  > = {
    loading: {
      icon: <Loader2 className="size-9 animate-spin text-muted-foreground" aria-hidden="true" />,
      ...copy.states.loading,
      retry: false,
    },
    denied: {
      icon: <ShieldAlert className="size-9 text-destructive" aria-hidden="true" />,
      ...copy.states.denied,
      retry: true,
    },
    unsupported: {
      icon: <VideoOff className="size-9 text-muted-foreground" aria-hidden="true" />,
      ...copy.states.unsupported,
      retry: false,
    },
    error: {
      icon: <AlertTriangle className="size-9 text-destructive" aria-hidden="true" />,
      ...copy.states.error,
      retry: true,
    },
    "no-devices": {
      icon: <VideoOff className="size-9 text-muted-foreground" aria-hidden="true" />,
      ...copy.states.noDevices,
      retry: true,
    },
    simulation: {
      icon: <AlertTriangle className="size-9 text-amber-600" aria-hidden="true" />,
      ...copy.states.simulation,
      retry: true,
    },
  }

  const streaming = status === "streaming"
  const trackingOn = streaming && prefs.showLandmarks
  // Once real body/hand points are drawn, the static outline would only get in the way.
  const showGuide = streaming && prefs.showFramingGuide && !(trackingOn && tracking?.status === "tracking")

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card className="overflow-hidden p-0">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-5 pt-4 pb-3 text-start sm:px-6">
          <p className="text-sm font-bold tracking-[0.12em] text-[#1D4ED8] uppercase">{copy.eyebrow}</p>
          <p className="text-sm text-muted-foreground">{copy.hint}</p>
        </div>
        <div className="px-3 sm:px-4">
          <div
            className={cn(
              "relative overflow-hidden rounded-[1.5rem] border-2",
              streaming
                ? "state-active-ring aspect-video border-[color:var(--primary)]/40 bg-slate-900"
                : "min-h-[22rem] border-dashed border-[color:var(--primary)]/25 bg-white/50 sm:aspect-video sm:min-h-0",
            )}
          >
            {/* Video + landmark points share one (optionally mirrored) layer so points line up with the image. */}
            <div className={cn("absolute inset-0", prefs.mirrorVideo && "-scale-x-100")}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={cn(
                  "absolute inset-0 size-full object-cover",
                  streaming ? "opacity-100" : "pointer-events-none opacity-0",
                )}
              />
              {trackingOn ? <LandmarkOverlay videoRef={videoRef} onInfo={setTracking} /> : null}
            </div>

            {showGuide ? <FramingGuide /> : null}

            {streaming ? (
              <>
                <div className="absolute start-3 top-3 z-10 flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-sm font-semibold text-foreground shadow-sm backdrop-blur">
                    <span className="relative flex size-2" aria-hidden="true">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                      <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                    </span>
                    <Video className="size-4 text-emerald-600" aria-hidden="true" />
                    {copy.on}
                  </span>
                  {prefs.mirrorVideo ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-muted-foreground shadow-sm">
                      <FlipHorizontal2 className="size-3.5" aria-hidden="true" />
                      {copy.mirrored}
                    </span>
                  ) : null}
                </div>

                <div className="absolute inset-x-3 bottom-3 z-10 flex flex-col items-center gap-1.5 text-center">
                  {trackingOn && tracking ? <TrackingChip info={tracking} /> : null}
                  {showGuide ? (
                    <span className="inline-flex max-w-full rounded-full bg-white/90 px-3.5 py-1.5 text-sm font-medium text-foreground shadow-sm backdrop-blur">
                      {copy.framingHint}
                    </span>
                  ) : null}
                </div>
              </>
            ) : (
              <div className="relative flex size-full min-h-[inherit] flex-col items-center justify-center gap-4 px-6 py-8 text-center sm:absolute sm:inset-0">
                <div className="flex size-20 items-center justify-center rounded-full bg-white shadow-[var(--pop-glow)] ring-1 ring-[color:var(--primary)]/15">
                  {statusCopy[status].icon}
                </div>
                <div className="max-w-md">
                  <p className="text-lg font-bold text-brand-navy sm:text-xl">{statusCopy[status].title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">{statusCopy[status].desc}</p>
                  {status === "denied" ? (
                    <ol className="mt-3 list-decimal space-y-1 ps-5 text-start text-sm text-foreground">
                      {copy.deniedSteps.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  ) : null}
                  {IS_DEV && errorInfo && (status === "denied" || status === "error" || status === "no-devices") && (
                    <p className="mt-2 font-mono text-xs text-destructive/80" dir="ltr">
                      {errorInfo.name}
                    </p>
                  )}
                </div>
                {statusCopy[status].retry && (
                  <Button className="h-11 rounded-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] px-5 text-white" onClick={handleRetry}>
                    <RotateCcw className="size-4" aria-hidden="true" />
                    {copy.retry}
                  </Button>
                )}
              </div>
            )}

            {/* Dev-only debug HUD (never rendered in production builds). */}
            {IS_DEV ? (
              <>
                <button
                  type="button"
                  onClick={() => setDebugOpen((v) => !v)}
                  aria-label={copy.debugToggle}
                  aria-pressed={debugOpen}
                  className="absolute end-2 top-2 z-20 flex size-10 items-center justify-center rounded-full bg-background/80 text-muted-foreground shadow-sm ring-1 ring-border transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Bug className="size-4" aria-hidden="true" />
                </button>
                {debugOpen && (
                  <div
                    dir="ltr"
                    className="absolute end-2 top-14 z-20 max-w-[220px] rounded-lg bg-background/95 px-2.5 py-2 text-start font-mono text-[11px] leading-relaxed text-foreground shadow-lg ring-1 ring-border"
                  >
                    <div>state: {status}</div>
                    <div>resolution: {resolution ? `${resolution.width}x${resolution.height}` : "—"}</div>
                    <div>device: {preferredDeviceId ? preferredDeviceId.slice(0, 8) : "default"}</div>
                    <div>
                      tracking: {trackingOn ? `${tracking?.status ?? "—"} · hands ${tracking?.hands ?? 0} · body ${tracking?.body ? "yes" : "no"}` : "off"}
                    </div>
                    {errorInfo && <div className="text-destructive">error: {errorInfo.name}</div>}
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
        {footer ? <div className="px-4 py-4 sm:px-6">{footer}</div> : <div className="h-3 sm:h-4" />}
      </Card>
    </motion.div>
  )
})

/** Decorative head/shoulders + hands-zone outline. Symmetric, so it needs no mirroring. */
function FramingGuide() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 160 90"
      preserveAspectRatio="xMidYMid meet"
      className="pointer-events-none absolute inset-0 size-full"
      fill="none"
    >
      <rect
        x="28"
        y="40"
        width="104"
        height="44"
        rx="8"
        stroke="white"
        strokeOpacity="0.7"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        vectorEffect="non-scaling-stroke"
        fill="white"
        fillOpacity="0.06"
      />
      <ellipse cx="80" cy="26" rx="11" ry="14" stroke="white" strokeOpacity="0.8" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      <path
        d="M48 90 C50 62 62 48 80 46 C98 48 110 62 112 90"
        stroke="white"
        strokeOpacity="0.8"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

/** Live status of the body/hand tracker, with the hand colour key once hands are found. */
function TrackingChip({ info }: { info: TrackingInfo }) {
  const { t, fmt } = useI18n()
  const copy = t.app.camera.tracking
  const base =
    "inline-flex max-w-full items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium shadow-sm backdrop-blur"

  if (info.status === "loading") {
    return (
      <span role="status" className={cn(base, "bg-white/90 text-foreground")}>
        <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden="true" />
        {copy.loading}
      </span>
    )
  }
  if (info.status === "error") {
    return (
      <span role="status" className={cn(base, "bg-amber-50/95 text-amber-800 ring-1 ring-amber-300/60")}>
        <AlertTriangle className="size-4 shrink-0" aria-hidden="true" />
        {copy.error}
      </span>
    )
  }
  if (info.hands === 0) {
    return (
      <span className={cn(base, "bg-white/90 text-foreground")}>
        <Hand className="size-4 shrink-0" aria-hidden="true" />
        {info.body ? copy.showHands : copy.noOne}
      </span>
    )
  }
  return (
    <span className={cn(base, "bg-white/90 text-foreground")}>
      <span className="relative flex size-2" aria-hidden="true">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
        <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
      </span>
      {fmt(info.hands === 1 ? copy.oneHand : copy.hands, { count: info.hands })}
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground" aria-hidden="true">
        <span className="size-2.5 rounded-full bg-[#ff8a3d]" />
        <span className="size-2.5 rounded-full bg-[#38bdf8]" />
      </span>
    </span>
  )
}
