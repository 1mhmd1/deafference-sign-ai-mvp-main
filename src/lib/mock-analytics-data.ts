export interface ActivityLogEntry {
  id: string
  admin: string
  action: 'user_created' | 'user_suspended' | 'user_activated' | 'user_deleted' | 'role_changed' | 'content_updated' | 'settings_changed'
  description: string
  targetUser?: string
  timestamp: string
  ipAddress: string
}

export interface DailySignup {
  date: string
  count: number
}

export interface TranslationModeUsage {
  mode: 'speech-to-text' | 'text-to-speech' | 'sign-to-text'
  count: number
  percentage: number
}

export const MOCK_ACTIVITY_LOG: ActivityLogEntry[] = [
  { id: 'log_001', admin: 'Aya Raneem', action: 'user_suspended', description: 'Suspended user account', targetUser: 'James O\'Brien', timestamp: '2026-10-12T14:32:00Z', ipAddress: '192.168.1.105' },
  { id: 'log_002', admin: 'Sarah Chen', action: 'content_updated', description: 'Updated Hero section headlines', targetUser: undefined, timestamp: '2026-10-12T13:15:22Z', ipAddress: '192.168.1.42' },
  { id: 'log_003', admin: 'Aya Raneem', action: 'role_changed', description: 'Changed user role to Admin', targetUser: 'Marcus Williams', timestamp: '2026-10-12T11:45:30Z', ipAddress: '192.168.1.105' },
  { id: 'log_004', admin: 'Sarah Chen', action: 'user_created', description: 'Created new user account', targetUser: 'new_user@example.com', timestamp: '2026-10-12T10:20:15Z', ipAddress: '192.168.1.42' },
  { id: 'log_005', admin: 'Aya Raneem', action: 'settings_changed', description: 'Updated system settings', targetUser: undefined, timestamp: '2026-10-11T16:55:00Z', ipAddress: '192.168.1.105' },
  { id: 'log_006', admin: 'Sarah Chen', action: 'user_activated', description: 'Activated suspended account', targetUser: 'Emma Johnson', timestamp: '2026-10-11T14:30:45Z', ipAddress: '192.168.1.42' },
  { id: 'log_007', admin: 'Aya Raneem', action: 'content_updated', description: 'Updated Pricing section', targetUser: undefined, timestamp: '2026-10-11T09:12:30Z', ipAddress: '192.168.1.105' },
  { id: 'log_008', admin: 'Sarah Chen', action: 'user_deleted', description: 'Deleted inactive user account', targetUser: 'old_user@example.com', timestamp: '2026-10-10T15:22:00Z', ipAddress: '192.168.1.42' },
  { id: 'log_009', admin: 'Aya Raneem', action: 'role_changed', description: 'Changed user role to Individual', targetUser: 'Sophia Martinez', timestamp: '2026-10-10T11:00:15Z', ipAddress: '192.168.1.105' },
  { id: 'log_010', admin: 'Sarah Chen', action: 'content_updated', description: 'Updated About Us section', targetUser: undefined, timestamp: '2026-10-10T08:45:30Z', ipAddress: '192.168.1.42' },
]

export const MOCK_DAILY_SIGNUPS: DailySignup[] = [
  { date: '2026-10-02', count: 3 },
  { date: '2026-10-03', count: 5 },
  { date: '2026-10-04', count: 2 },
  { date: '2026-10-05', count: 7 },
  { date: '2026-10-06', count: 4 },
  { date: '2026-10-07', count: 8 },
  { date: '2026-10-08', count: 6 },
  { date: '2026-10-09', count: 5 },
  { date: '2026-10-10', count: 9 },
  { date: '2026-10-11', count: 7 },
  { date: '2026-10-12', count: 4 },
]

export const MOCK_TRANSLATION_USAGE: TranslationModeUsage[] = [
  { mode: 'speech-to-text', count: 1245, percentage: 45 },
  { mode: 'text-to-speech', count: 987, percentage: 36 },
  { mode: 'sign-to-text', count: 456, percentage: 19 },
]

export interface AnalyticsMetrics {
  totalUsers: number
  dailyActiveUsers: number
  weeklyActiveUsers: number
  totalTranslations: number
  averageSessionDuration: string
  uptime: string
}

export const MOCK_ANALYTICS_METRICS: AnalyticsMetrics = {
  totalUsers: 8,
  dailyActiveUsers: 6,
  weeklyActiveUsers: 8,
  totalTranslations: 2688,
  averageSessionDuration: '12m 45s',
  uptime: '99.9%',
}
