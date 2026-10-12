"use client"

import { useRef, useState } from "react"
import { Container } from "@/components/shared/container"
import { useI18n } from "@/i18n/use-i18n"
import { Pipeline } from "./pipeline"
import { AccessibilityPanel } from "./accessibility-panel"
import { SettingsDebugPanel } from "./settings-debug-panel"
import { WorkspaceTools } from "./application-header"
import { CameraView, type CameraStatus, type CameraViewHandle } from "./camera-view"
import { StatusCard, type RecognitionStatus } from "./status-card"
import { TranslationPanel } from "./translation-panel"
import { ControlPanel } from "./control-panel"
import { RecentTranslations } from "./recent-translations"
import { TipsCard } from "./tips-card"

// Top-level switch for the "Demo pipeline" disclosure badge and the honest
// "recognition not connected" copy. Flip to `false` only once /translate is
// wired to a real hand-tracking + recognition model that feeds `transcript`,
// `confidence` and `landmarks` below.
const isMockMode = true

/** Maps the real camera lifecycle onto the status card. Recognizer-driven states need a model. */
function statusFromCamera(camera: CameraStatus): RecognitionStatus {
  if (camera === "loading") return "camera-loading"
  if (camera === "streaming") return "ready"
  return "error"
}

export function DeafferenceApp() {
  const { t } = useI18n()
  const [accessibilityOpen, setAccessibilityOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>("loading")
  const [statusPreview, setStatusPreview] = useState<RecognitionStatus | null>(null)
  const cameraRef = useRef<CameraViewHandle>(null)

  // No recognizer exists yet: transcript/confidence/landmarks stay empty rather than faked.
  const recognitionConnected = !isMockMode
  const transcript = ""
  const confidence: number | null = null

  const cameraStates = t.app.camera.states
  const cameraErrorTitle: Partial<Record<CameraStatus, string>> = {
    denied: cameraStates.denied.title,
    unsupported: cameraStates.unsupported.title,
    error: cameraStates.error.title,
    "no-devices": cameraStates.noDevices.title,
    simulation: cameraStates.simulation.title,
  }
  const liveStatus = statusFromCamera(cameraStatus)
  const status = statusPreview ?? liveStatus
  const statusDescription = !statusPreview && liveStatus === "error" ? cameraErrorTitle[cameraStatus] : undefined

  return (
    <div id="top">
      <main className="pt-6 pb-16 sm:pt-8">
        <Container fluid>
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(380px,460px)] xl:items-start">
            {/* Stage: the camera gets most of the screen, with its controls right under it. */}
            <section>
              <CameraView
                ref={cameraRef}
                onStateChange={setCameraStatus}
                footer={
                  <ControlPanel
                    cameraActive={cameraStatus === "streaming"}
                    onStartCamera={() => cameraRef.current?.restart()}
                    trailing={
                      <WorkspaceTools
                        onOpenAccessibility={() => setAccessibilityOpen(true)}
                        onOpenSettings={() => setSettingsOpen(true)}
                      />
                    }
                  />
                }
              />
            </section>

            {/* Result column: what Judy sees and the translation. */}
            <section className="space-y-5 xl:sticky xl:top-28">
              <StatusCard status={status} recognitionConnected={recognitionConnected} description={statusDescription} />
              <TranslationPanel
                transcript={transcript}
                confidence={confidence}
                recognitionConnected={recognitionConnected}
              />
            </section>
          </div>

          <div className="mt-6 space-y-6">
            <Pipeline currentStep={0} isMockMode={isMockMode} />
            <div className="grid gap-6 lg:grid-cols-2">
              <RecentTranslations />
              <TipsCard />
            </div>
          </div>
        </Container>
      </main>

      <AccessibilityPanel open={accessibilityOpen} onClose={() => setAccessibilityOpen(false)} />
      <SettingsDebugPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        statusPreview={statusPreview}
        onStatusPreviewChange={setStatusPreview}
      />
    </div>
  )
}
