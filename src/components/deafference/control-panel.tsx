"use client"

import { Camera, RotateCcw, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/i18n/use-i18n"

export interface ControlPanelProps {
  onStartCamera?: () => void
  /** Shows a "Clear" button when provided. */
  onClearTranslation?: () => void
  /** True while the camera is streaming — the primary button then restarts it. */
  cameraActive?: boolean
  /** Extra controls on the far side of the bar (e.g. settings / accessibility). */
  trailing?: React.ReactNode
}

/** Video-call style control bar that sits under the camera. */
export function ControlPanel({ onStartCamera, onClearTranslation, cameraActive = false, trailing }: ControlPanelProps) {
  const { t } = useI18n()
  const copy = t.app.controls

  return (
    <div role="group" aria-label={copy.eyebrow} className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2.5">
        <Button
          className="h-12 rounded-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] px-6 text-base text-white shadow-[0_14px_32px_-12px_rgba(37,99,235,0.55)]"
          onClick={onStartCamera}
        >
          {cameraActive ? <RotateCcw className="size-5" aria-hidden="true" /> : <Camera className="size-5" aria-hidden="true" />}
          {cameraActive ? copy.restartCamera : copy.startCamera}
        </Button>
        {onClearTranslation ? (
          <Button variant="outline" className="h-12 rounded-full bg-white/70 px-5" onClick={onClearTranslation}>
            <Trash2 className="size-4" aria-hidden="true" />
            {copy.clear}
          </Button>
        ) : null}
        <Button variant="outline" className="h-12 rounded-full bg-white/50 px-5" disabled>
          <Upload className="size-4" aria-hidden="true" />
          {copy.uploadVideo}
          <span className="rounded-full bg-[color:var(--primary)]/10 px-2 py-0.5 text-[11px] font-semibold text-[#1D4ED8]">
            {copy.comingSoon}
          </span>
        </Button>
      </div>
      {trailing}
    </div>
  )
}
