"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import styles from "./dashboard.module.css"

export default function DashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Dashboard</h1>
        <button onClick={handleLogout} className="btn btn-secondary" disabled={isLoading}>
          {isLoading ? "Signing out..." : "Sign out"}
        </button>
      </header>

      <main className={styles.main}>
        <div className={styles.card}>
          <h2>Welcome to Deafference</h2>
          <p>You're signed in and ready to go. More features coming soon.</p>
        </div>
      </main>
    </div>
  )
}
