import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Loading } from '@/components/shared/loading'
import { ProfileHub } from '@/components/profile/profile-hub'

export const metadata: Metadata = {
  title: 'Deafference — Profile',
  description: 'Your Deafference profile, history and settings in one place.',
}

export default function ProfilePage() {
  return (
    // useSearchParams (tab sync) needs a Suspense boundary for static rendering.
    <Suspense fallback={<div className="p-6"><Loading /></div>}>
      <ProfileHub />
    </Suspense>
  )
}
