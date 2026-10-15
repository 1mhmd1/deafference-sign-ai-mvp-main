'use client'

import { AvatarSection, type AvatarSectionProps } from './avatar-section'
import { PersonalInfoForm, type PersonalInfoFormProps } from './personal-info-form'
import { SecurityForm, type SecurityFormProps } from './security-form'
import { DangerZone, type DangerZoneProps } from './danger-zone'
import { LanguageSection } from './language-section'

export interface ProfileSettingsProps {
  defaultValues?: PersonalInfoFormProps['defaultValues']
  displayName?: AvatarSectionProps['displayName']
  initialAvatarUrl?: AvatarSectionProps['initialAvatarUrl']
  onUploadAvatar?: AvatarSectionProps['onUpload']
  onRemoveAvatar?: AvatarSectionProps['onRemove']
  onSavePersonalInfo?: PersonalInfoFormProps['onSave']
  onUpdatePassword?: SecurityFormProps['onUpdatePassword']
  hasPassword?: SecurityFormProps['hasPassword']
  onSignedOut?: DangerZoneProps['onSignedOut']
  onDeleteAccount?: DangerZoneProps['onDeleteAccount']
}

export function ProfileSettings({
  defaultValues,
  displayName,
  initialAvatarUrl,
  onUploadAvatar,
  onRemoveAvatar,
  onSavePersonalInfo,
  onUpdatePassword,
  hasPassword,
  onSignedOut,
  onDeleteAccount,
}: ProfileSettingsProps) {
  return (
    // Two columns on wide screens: who you are (photo, details, language) | how you sign in (password, account).
    <div className="grid items-start gap-6 lg:grid-cols-2">
      <div className="flex flex-col gap-6">
        <AvatarSection
          displayName={displayName}
          initialAvatarUrl={initialAvatarUrl}
          onUpload={onUploadAvatar}
          onRemove={onRemoveAvatar}
        />
        <PersonalInfoForm defaultValues={defaultValues} onSave={onSavePersonalInfo} />
        <LanguageSection />
      </div>
      <div className="flex flex-col gap-6">
        <SecurityForm onUpdatePassword={onUpdatePassword} hasPassword={hasPassword} />
        <DangerZone onSignedOut={onSignedOut} onDeleteAccount={onDeleteAccount} />
      </div>
    </div>
  )
}
