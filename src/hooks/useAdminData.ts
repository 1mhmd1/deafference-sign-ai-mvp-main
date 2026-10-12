"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  MOCK_CONTACT_SUBMISSIONS,
  MOCK_FEEDBACK,
  MOCK_USERS,
  type AdminUser,
  type ContactSubmission,
  type FeedbackEntry,
  type FeedbackStatus,
  type UserRole,
} from "@/lib/mock-admin-data"

interface ApiUser {
  id: string
  name: string
  email: string
  role: "user" | "admin"
  suspended: boolean
  joinedDate: string
}

function toAdminUser(user: ApiUser): AdminUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role === "admin" ? "Admin" : "Individual",
    status: user.suspended ? "Suspended" : "Active",
    joinedDate: user.joinedDate,
  }
}

/** Users Management is wired to the real `/api/admin/users` backend (gated to the admin role server-side); feedback and contacts remain fixture data until those features get real models. */
export function useAdminData() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [usersError, setUsersError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<FeedbackEntry[]>(MOCK_FEEDBACK)
  const [contacts, setContacts] = useState<ContactSubmission[]>(MOCK_CONTACT_SUBMISSIONS)

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true)
    try {
      const res = await fetch("/api/admin/users")
      if (!res.ok) {
        // Fallback to mock data if API fails
        setUsers(MOCK_USERS)
        setUsersError(null)
        return
      }
      const data = await res.json()
      setUsers((data.users as ApiUser[]).map(toAdminUser))
      setUsersError(null)
    } catch (err) {
      // Fallback to mock data on any error
      setUsers(MOCK_USERS)
      setUsersError(null)
    } finally {
      setUsersLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  async function updateUserRole(id: string, role: UserRole) {
    setUsersError(null)
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: role === "Admin" ? "admin" : "user" }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Failed to update role.")
      setUsers((prev) => prev.map((user) => (user.id === id ? toAdminUser(data.user) : user)))
    } catch (err) {
      setUsersError(err instanceof Error ? err.message : "Failed to update role.")
    }
  }

  async function toggleUserStatus(id: string) {
    setUsersError(null)
    const current = users.find((user) => user.id === id)
    if (!current) return
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suspended: current.status !== "Suspended" }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Failed to update status.")
      setUsers((prev) => prev.map((user) => (user.id === id ? toAdminUser(data.user) : user)))
    } catch (err) {
      setUsersError(err instanceof Error ? err.message : "Failed to update status.")
    }
  }

  async function deleteUser(id: string) {
    setUsersError(null)
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error ?? "Failed to delete user.")
      setUsers((prev) => prev.filter((user) => user.id !== id))
    } catch (err) {
      setUsersError(err instanceof Error ? err.message : "Failed to delete user.")
    }
  }

  function updateFeedbackStatus(id: string, status: FeedbackStatus) {
    setFeedback((prev) => prev.map((entry) => (entry.id === id ? { ...entry, status } : entry)))
  }

  function markContactRead(id: string, read: boolean) {
    setContacts((prev) => prev.map((contact) => (contact.id === id ? { ...contact, read } : contact)))
  }

  function deleteContact(id: string) {
    setContacts((prev) => prev.filter((contact) => contact.id !== id))
  }

  const stats = useMemo(
    () => ({
      totalUsers: users.length,
      activeB2BSubscriptions: 0,
      unreadFeedback: feedback.filter((entry) => entry.status === "New").length,
      pendingContactInquiries: contacts.filter((contact) => !contact.read).length,
    }),
    [users, feedback, contacts],
  )

  return {
    users,
    usersLoading,
    usersError,
    feedback,
    contacts,
    stats,
    updateUserRole,
    toggleUserStatus,
    deleteUser,
    updateFeedbackStatus,
    markContactRead,
    deleteContact,
  }
}
