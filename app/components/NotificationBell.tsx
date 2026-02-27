"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

type Notification = {
    id: string
    type: string
    message: string
    read: boolean
    link?: string | null
    referenceId?: string | null
    createdAt: string
}

export default function NotificationBell() {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [processingId, setProcessingId] = useState<string | null>(null)
    const ref = useRef<HTMLDivElement>(null)

    const unreadCount = notifications.filter(n => !n.read).length

    const fetchNotifications = async () => {
        const res = await fetch("/api/notifications")
        if (res.ok) setNotifications(await res.json())
    }

    useEffect(() => {
        fetchNotifications()
        const interval = setInterval(fetchNotifications, 30000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener("mousedown", handleClick)
        return () => document.removeEventListener("mousedown", handleClick)
    }, [])

    const handleOpen = async () => {
        setOpen(prev => !prev)
        if (!open && unreadCount > 0) {
            await fetch("/api/notifications", { method: "PATCH" })
            setNotifications(prev => prev.map(n => ({ ...n, read: true })))
        }
    }

    const handleClick = (n: Notification) => {
        if (n.type === "INVITE_PENDING") return
        setOpen(false)
        if (n.link) router.push(n.link)
    }

    const handleInviteAction = async (n: Notification, action: "accept" | "decline") => {
        if (!n.referenceId) return
        setProcessingId(n.id)

        const res = await fetch(`/api/invites/${n.referenceId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action })
        })

        if (res.ok) {
            setNotifications(prev => prev.filter(notif => notif.id !== n.id))
            if (action === "accept" && n.link) {
                setOpen(false)
                router.push(n.link)
            }
        }
        setProcessingId(null)
    }

    const handleClear = async () => {
        await fetch("/api/notifications", { method: "DELETE" })
        setNotifications([])
    }

    const timeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime()
        const mins = Math.floor(diff / 60000)
        const hours = Math.floor(diff / 3600000)
        const days = Math.floor(diff / 86400000)
        if (mins < 1) return "Baru saja"
        if (mins < 60) return `${mins} menit lalu`
        if (hours < 24) return `${hours} jam lalu`
        return `${days} hari lalu`
    }

    const typeIcon: Record<string, string> = {
        INVITE_PENDING: "📩",
        INVITE_DECLINED: "❌",
        MEMBER_JOINED: "👋",
        MEMBER_LEFT: "🚪",
        MEMBER_KICKED: "⛔",
        PROJECT_DELETED: "🗑️",
        NEW_OWNER: "👑",
        DEADLINE_SOON: "⏰",
        DEADLINE_OVERDUE: "🚨",
    }

    return (
        <div ref={ref} style={{ position: "relative" }}>
            <button
                onClick={handleOpen}
                style={{ background: "none", border: "none", cursor: "pointer", position: "relative", padding: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8d8d8d" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadCount > 0 && (
                    <span style={{
                        position: "absolute", top: 0, right: 0,
                        background: "#da1e28", color: "#fff",
                        fontSize: 9, fontFamily: "'IBM Plex Mono', monospace",
                        width: 14, height: 14, borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600
                    }}>
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div style={{
                    position: "absolute", top: "calc(100% + 8px)", right: 0,
                    background: "#ffffff", border: "1px solid #e0e0e0",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                    zIndex: 100, width: 320, maxHeight: 480, overflowY: "auto"
                }}>
                    <div style={{ padding: "12px 16px", borderBottom: "1px solid #e0e0e0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <p style={{ fontSize: 12, fontWeight: 500, color: "#161616", fontFamily: "'IBM Plex Sans', sans-serif" }}>
                            Notifikasi
                        </p>
                        {notifications.length > 0 && (
                            <button onClick={handleClear} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#8d8d8d", fontFamily: "'IBM Plex Mono', monospace" }}>
                                Hapus semua
                            </button>
                        )}
                    </div>

                    {notifications.length === 0 ? (
                        <p style={{ padding: "24px 16px", fontSize: 13, color: "#a8a8a8", fontFamily: "'IBM Plex Sans', sans-serif", textAlign: "center" }}>
                            Tidak ada notifikasi
                        </p>
                    ) : (
                        notifications.map(n => (
                            <div
                                key={n.id}
                                onClick={() => handleClick(n)}
                                style={{
                                    padding: "12px 16px",
                                    borderBottom: "1px solid #f4f4f4",
                                    cursor: n.type !== "INVITE_PENDING" && n.link ? "pointer" : "default",
                                    background: n.read ? "#ffffff" : "#f0f4ff",
                                }}
                                onMouseOver={e => { if (n.type !== "INVITE_PENDING" && n.link) e.currentTarget.style.background = "#f4f4f4" }}
                                onMouseOut={e => { e.currentTarget.style.background = n.read ? "#ffffff" : "#f0f4ff" }}
                            >
                                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                                    <span style={{ fontSize: 16, flexShrink: 0 }}>{typeIcon[n.type] || "🔔"}</span>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: 13, color: "#161616", lineHeight: 1.4, fontFamily: "'IBM Plex Sans', sans-serif", marginBottom: 4 }}>
                                            {n.message}
                                        </p>
                                        <p style={{ fontSize: 11, color: "#8d8d8d", fontFamily: "'IBM Plex Mono', monospace", marginBottom: n.type === "INVITE_PENDING" ? 8 : 0 }}>
                                            {timeAgo(n.createdAt)}
                                        </p>

                                        {n.type === "INVITE_PENDING" && n.referenceId && (
                                            <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                                                <button
                                                    onClick={e => { e.stopPropagation(); handleInviteAction(n, "accept") }}
                                                    disabled={processingId === n.id}
                                                    style={{
                                                        background: "#0f62fe", border: "none", color: "#fff",
                                                        padding: "6px 14px", fontSize: 12,
                                                        fontFamily: "'IBM Plex Sans', sans-serif",
                                                        cursor: processingId === n.id ? "not-allowed" : "pointer"
                                                    }}
                                                >
                                                    Terima
                                                </button>
                                                <button
                                                    onClick={e => { e.stopPropagation(); handleInviteAction(n, "decline") }}
                                                    disabled={processingId === n.id}
                                                    style={{
                                                        background: "transparent", border: "1px solid #8d8d8d", color: "#525252",
                                                        padding: "6px 14px", fontSize: 12,
                                                        fontFamily: "'IBM Plex Sans', sans-serif",
                                                        cursor: processingId === n.id ? "not-allowed" : "pointer"
                                                    }}
                                                >
                                                    Tolak
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    {!n.read && (
                                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#0f62fe", flexShrink: 0, marginTop: 4 }} />
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}