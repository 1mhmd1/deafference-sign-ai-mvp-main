"use client"

import { useEffect, useRef, type RefObject } from "react"
import type { HandLandmarker, NormalizedLandmark, PoseLandmarker } from "@mediapipe/tasks-vision"

/**
 * On-device body + hand tracking drawn over the camera, using MediaPipe — the
 * same landmark family (pose + left/right hand) as the team's ASL training data.
 * Frames never leave the browser; only the wasm runtime and the two model files
 * are downloaded (jsDelivr / Google's model bucket). This is tracking only: no
 * sign recognition happens here.
 */

// Keep in step with the installed @mediapipe/tasks-vision version (package.json).
const WASM_BASE = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm"
const HAND_MODEL = "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task"
const POSE_MODEL =
  "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task"

export type TrackingStatus = "loading" | "tracking" | "error"

export interface TrackingInfo {
  status: TrackingStatus
  /** Hands found in the latest frame (0–2). */
  hands: number
  /** Whether a body (pose) was found in the latest frame. */
  body: boolean
}

// Pose indices 0–10 are face points; the face is left out so the hands stay readable.
const FIRST_BODY_POINT = 11
const MIN_VISIBILITY = 0.5

const BODY_LINE = "rgba(255, 255, 255, 0.85)"
const BODY_POINT = "#60a5fa"
const HAND_COLORS = { Left: "#ff8a3d", Right: "#38bdf8" } as const

export function LandmarkOverlay({
  videoRef,
  onInfo,
}: {
  videoRef: RefObject<HTMLVideoElement | null>
  /** Called when the tracker status or what it sees changes (not every frame). */
  onInfo?: (info: TrackingInfo) => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const onInfoRef = useRef(onInfo)
  useEffect(() => {
    onInfoRef.current = onInfo
  }, [onInfo])

  useEffect(() => {
    let cancelled = false
    let frame = 0
    let hands: HandLandmarker | null = null
    let pose: PoseLandmarker | null = null
    let last: TrackingInfo | null = null

    const report = (info: TrackingInfo) => {
      if (last && last.status === info.status && last.hands === info.hands && last.body === info.body) return
      last = info
      onInfoRef.current?.(info)
    }

    async function start() {
      report({ status: "loading", hands: 0, body: false })
      try {
        const vision = await import("@mediapipe/tasks-vision")
        const fileset = await vision.FilesetResolver.forVisionTasks(WASM_BASE)

        // GPU where available; some browsers/drivers refuse it, so retry on the CPU.
        async function create<T>(make: (delegate: "GPU" | "CPU") => Promise<T>) {
          try {
            return await make("GPU")
          } catch {
            return await make("CPU")
          }
        }
        hands = await create((delegate) =>
          vision.HandLandmarker.createFromOptions(fileset, {
            baseOptions: { modelAssetPath: HAND_MODEL, delegate },
            runningMode: "VIDEO",
            numHands: 2,
          }),
        )
        pose = await create((delegate) =>
          vision.PoseLandmarker.createFromOptions(fileset, {
            baseOptions: { modelAssetPath: POSE_MODEL, delegate },
            runningMode: "VIDEO",
            numPoses: 1,
          }),
        )
        // Unmounted while the models were loading: the cleanup already ran, so release them here.
        if (cancelled) {
          hands.close()
          pose.close()
          return
        }

        const { DrawingUtils, HandLandmarker, PoseLandmarker } = vision
        const handLinks = HandLandmarker.HAND_CONNECTIONS
        const bodyLinks = PoseLandmarker.POSE_CONNECTIONS.filter(
          (c) => c.start >= FIRST_BODY_POINT && c.end >= FIRST_BODY_POINT,
        )
        let lastTime = -1

        const loop = () => {
          if (cancelled) return
          frame = requestAnimationFrame(loop)
          const video = videoRef.current
          const canvas = canvasRef.current
          if (!video || !canvas || video.readyState < 2 || video.currentTime === lastTime) return
          lastTime = video.currentTime

          if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
          }
          const ctx = canvas.getContext("2d")
          if (!ctx) return
          const draw = new DrawingUtils(ctx)
          const now = performance.now()
          const handResult = hands!.detectForVideo(video, now)
          const poseResult = pose!.detectForVideo(video, now)
          const scale = Math.max(1, canvas.width / 640)

          ctx.clearRect(0, 0, canvas.width, canvas.height)

          const body = poseResult.landmarks[0]
          if (body) {
            // Hide joints the model can't see (e.g. legs out of frame) instead of guessing them.
            const visible = (p: NormalizedLandmark | undefined) => !!p && (p.visibility ?? 1) >= MIN_VISIBILITY
            const links = bodyLinks.filter((c) => visible(body[c.start]) && visible(body[c.end]))
            draw.drawConnectors(body, links, { color: BODY_LINE, lineWidth: 3 * scale })
            draw.drawLandmarks(
              body.slice(FIRST_BODY_POINT).filter(visible),
              { color: "white", fillColor: BODY_POINT, lineWidth: 1.5 * scale, radius: 4 * scale },
            )
          }

          handResult.landmarks.forEach((hand, i) => {
            const side = handResult.handedness[i]?.[0]?.categoryName === "Left" ? "Left" : "Right"
            const color = HAND_COLORS[side]
            draw.drawConnectors(hand, handLinks, { color, lineWidth: 3 * scale })
            draw.drawLandmarks(hand, { color: "white", fillColor: color, lineWidth: 1.5 * scale, radius: 3.5 * scale })
          })

          report({ status: "tracking", hands: handResult.landmarks.length, body: !!body })
        }
        loop()
      } catch (err) {
        console.warn("[LandmarkOverlay] Body/hand tracking could not start.", err)
        if (!cancelled) report({ status: "error", hands: 0, body: false })
      }
    }

    void start()

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      hands?.close()
      pose?.close()
    }
  }, [videoRef])

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full object-cover" />
}
