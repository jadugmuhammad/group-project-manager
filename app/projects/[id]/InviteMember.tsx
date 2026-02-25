"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function InviteMember({ projectId, isOwner }: { projectId: string; isOwner: boolean }) {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    if (!isOwner) return null

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage("")
        setError("")

        const res = await fetch(`/api/projects/${projectId}/members`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        })

        const data = await res.json()

        if (!res.ok) {
            setError(data.message)
        } else {
            setMessage("Anggota berhasil ditambahkan!")
            setEmail("")
            router.refresh()
        }

        setLoading(false)
    }

    return (
        <div>
            <form onSubmit={handleInvite} style={{ display: "flex", gap: 0 }}>
                <input
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    style={{
                        flex: 1,
                        background: "#f4f4f4",
                        border: "1px solid #8d8d8d",
                        borderRight: "none",
                        padding: "10px 14px",
                        fontSize: 13,
                        fontFamily: "'IBM Plex Sans', sans-serif",
                        color: "#161616",
                        outline: "none"
                    }}
                />
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        background: "#0f62fe",
                        color: "#ffffff",
                        border: "none",
                        padding: "10px 20px",
                        fontSize: 13,
                        fontFamily: "'IBM Plex Sans', sans-serif",
                        cursor: loading ? "not-allowed" : "pointer",
                        opacity: loading ? 0.7 : 1,
                        whiteSpace: "nowrap"
                    }}
                >
                    {loading ? "..." : "Undang"}
                </button>
            </form>
            {message && <p style={{ color: "#42be65", fontSize: 12, marginTop: 8, fontFamily: "'IBM Plex Mono', monospace" }}>{message}</p>}
            {error && <p style={{ color: "#da1e28", fontSize: 12, marginTop: 8, fontFamily: "'IBM Plex Mono', monospace" }}>{error}</p>}
        </div>
    )
}