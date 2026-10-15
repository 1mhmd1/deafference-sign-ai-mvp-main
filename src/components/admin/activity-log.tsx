'use client'

import { useId, useMemo, useState } from 'react'
import { Activity, Filter } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { formatDate } from '@/lib/utils'
import type { ActivityLogEntry } from '@/lib/mock-analytics-data'
import { EmptyState } from './empty-state'
import { Pagination } from './pagination'

const PAGE_SIZE = 10

const ACTION_LABELS: Record<ActivityLogEntry['action'], string> = {
  user_created: 'User Created',
  user_suspended: 'User Suspended',
  user_activated: 'User Activated',
  user_deleted: 'User Deleted',
  role_changed: 'Role Changed',
  content_updated: 'Content Updated',
  settings_changed: 'Settings Changed',
}

const ACTION_COLORS: Record<ActivityLogEntry['action'], string> = {
  user_created: 'bg-green-100 text-green-800 border-green-300',
  user_suspended: 'bg-red-100 text-red-800 border-red-300',
  user_activated: 'bg-blue-100 text-blue-800 border-blue-300',
  user_deleted: 'bg-red-100 text-red-800 border-red-300',
  role_changed: 'bg-purple-100 text-purple-800 border-purple-300',
  content_updated: 'bg-orange-100 text-orange-800 border-orange-300',
  settings_changed: 'bg-indigo-100 text-indigo-800 border-indigo-300',
}

interface ActivityLogProps {
  entries: ActivityLogEntry[]
}

export function ActivityLog({ entries }: ActivityLogProps) {
  const idPrefix = useId()
  const [searchTerm, setSearchTerm] = useState('')
  const [actionFilter, setActionFilter] = useState<'all' | ActivityLogEntry['action']>('all')
  const [page, setPage] = useState(1)

  const filteredEntries = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    return entries.filter((entry) => {
      const matchesTerm =
        term.length === 0 ||
        entry.admin.toLowerCase().includes(term) ||
        entry.description.toLowerCase().includes(term) ||
        (entry.targetUser?.toLowerCase().includes(term) ?? false)
      const matchesAction = actionFilter === 'all' || entry.action === actionFilter
      return matchesTerm && matchesAction
    })
  }, [entries, searchTerm, actionFilter])

  const pageCount = Math.max(1, Math.ceil(filteredEntries.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const pagedEntries = filteredEntries.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const uniqueActions = Array.from(new Set(entries.map((e) => e.action)))

  return (
    <Card>
      <section aria-labelledby={`${idPrefix}-heading`} className="flex flex-col gap-4">
        <h2 id={`${idPrefix}-heading`} className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Activity Log
        </h2>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <label htmlFor={`${idPrefix}-search`} className="sr-only">
              Search activity
            </label>
            <Input
              id={`${idPrefix}-search`}
              type="search"
              placeholder="Search by admin, description, or user…"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value)
                setPage(1)
              }}
            />
          </div>

          <div>
            <label htmlFor={`${idPrefix}-action-filter`} className="sr-only">
              Filter by action
            </label>
            <Select
              id={`${idPrefix}-action-filter`}
              value={actionFilter}
              onChange={(event) => {
                setActionFilter(event.target.value as 'all' | ActivityLogEntry['action'])
                setPage(1)
              }}
            >
              <option value="all">All actions</option>
              {uniqueActions.map((action) => (
                <option key={action} value={action}>
                  {ACTION_LABELS[action]}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                <th scope="col" className="px-3 py-2">
                  Timestamp
                </th>
                <th scope="col" className="px-3 py-2">
                  Admin
                </th>
                <th scope="col" className="px-3 py-2">
                  Action
                </th>
                <th scope="col" className="px-3 py-2">
                  Description
                </th>
                <th scope="col" className="px-3 py-2">
                  Target
                </th>
                <th scope="col" className="px-3 py-2">
                  IP Address
                </th>
              </tr>
            </thead>
            <tbody>
              {pagedEntries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-2">
                    <EmptyState
                      icon={Activity}
                      title="No activity found"
                      description="Try adjusting your filters or search term."
                    />
                  </td>
                </tr>
              ) : (
                pagedEntries.map((entry) => (
                  <tr key={entry.id} className="border-b border-border last:border-0">
                    <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(entry.timestamp)}
                    </td>
                    <td className="px-3 py-3 font-medium text-foreground">{entry.admin}</td>
                    <td className="px-3 py-3">
                      <Badge className={`${ACTION_COLORS[entry.action]} border`}>
                        {ACTION_LABELS[entry.action]}
                      </Badge>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{entry.description}</td>
                    <td className="px-3 py-3 text-muted-foreground text-xs">
                      {entry.targetUser ? <code className="bg-muted px-2 py-1 rounded">{entry.targetUser}</code> : '—'}
                    </td>
                    <td className="px-3 py-3 text-muted-foreground text-xs font-mono">{entry.ipAddress}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination page={currentPage} pageCount={pageCount} onPageChange={setPage} />
      </section>
    </Card>
  )
}
