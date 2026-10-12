'use client'

import { Users, Activity, TrendingUp, BarChart3 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import type { AnalyticsMetrics, DailySignup, TranslationModeUsage } from '@/lib/mock-analytics-data'

interface MetricCardProps {
  icon: React.ReactNode
  label: string
  value: string
  subtext?: string
  trend?: { value: number; direction: 'up' | 'down' }
}

function MetricCard({ icon, label, value, subtext, trend }: MetricCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {subtext && <p className="text-xs text-muted-foreground mt-2">{subtext}</p>}
        </div>
        <div className="text-muted-foreground">{icon}</div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-1 text-sm">
          <TrendingUp
            className={`w-4 h-4 ${trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}
          />
          <span className={trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}>
            {trend.direction === 'up' ? '+' : '−'}{trend.value}%
          </span>
          <span className="text-muted-foreground">vs last week</span>
        </div>
      )}
    </Card>
  )
}

interface AnalyticsProps {
  metrics: AnalyticsMetrics
  dailySignups: DailySignup[]
  translationUsage: TranslationModeUsage[]
}

export function Analytics({ metrics, dailySignups, translationUsage }: AnalyticsProps) {
  const maxSignups = Math.max(...dailySignups.map((d) => d.count))
  const totalSignups = dailySignups.reduce((sum, d) => sum + d.count, 0)

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<Users className="w-6 h-6" />}
          label="Total Users"
          value={metrics.totalUsers.toString()}
          subtext="Active accounts"
          trend={{ value: 12, direction: 'up' }}
        />
        <MetricCard
          icon={<Activity className="w-6 h-6" />}
          label="Daily Active Users"
          value={metrics.dailyActiveUsers.toString()}
          subtext={`${Math.round((metrics.dailyActiveUsers / metrics.totalUsers) * 100)}% of total`}
          trend={{ value: 8, direction: 'up' }}
        />
        <MetricCard
          icon={<BarChart3 className="w-6 h-6" />}
          label="Total Translations"
          value={metrics.totalTranslations.toLocaleString()}
          subtext="All time"
          trend={{ value: 24, direction: 'up' }}
        />
        <MetricCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="System Uptime"
          value={metrics.uptime}
          subtext={`Avg session: ${metrics.averageSessionDuration}`}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Signups Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Signups Over Time</h3>
          <div className="space-y-4">
            {dailySignups.map((day) => {
              const percentage = (day.count / maxSignups) * 100
              return (
                <div key={day.date}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">{day.date}</span>
                    <span className="text-sm font-medium text-foreground">{day.count}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-4">Total: {totalSignups} signups</p>
        </Card>

        {/* Translation Mode Usage */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Translation Mode Usage</h3>
          <div className="space-y-4">
            {translationUsage.map((usage) => (
              <div key={usage.mode}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground capitalize">
                    {usage.mode.replace(/-/g, ' ')}
                  </span>
                  <span className="text-sm text-muted-foreground">{usage.percentage}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      usage.mode === 'speech-to-text'
                        ? 'bg-blue-500'
                        : usage.mode === 'text-to-speech'
                          ? 'bg-green-500'
                          : 'bg-orange-500'
                    }`}
                    style={{ width: `${usage.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{usage.count} translations</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Total: {translationUsage.reduce((sum, u) => sum + u.count, 0)} translations
          </p>
        </Card>
      </div>
    </div>
  )
}
