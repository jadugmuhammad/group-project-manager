"use client"

import { useState } from "react"

type Member = {
    id: string
    name: string | null
}

export default function InviteMember({
    projectId,
    isOwner,
}: {
    projectId: string
    isOwner?: boolean
}) {
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const [error, setError] = useState(false)

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault()
        setMessage("")

        const res = await fetch(`/api/projects/${projectId}/members`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        })

        const data = await res.json()

        if (!res.ok) {
            setMessage(data.message)
            setError(true)
            return
        }

        setMessage("Undangan berhasil dikirim.")
        setError(false)
        setEmail("")
    }

    return (
        <form onSubmit={handleInvite}>
            <div style={{ display: "flex", gap: 2 }}>
                <input
                    type="email"
                    placeholder="Email anggota"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    style={{
                        flex: 1,
                        background: "#ffffff",
                        border: "none",
                        borderBottom: "2px solid #8d8d8d",
                        padding: "10px 14px",
                        fontSize: 13,
                        fontFamily: "'IBM Plex Sans', sans-serif",
                        color: "#161616",
                        outline: "none"
                    }}
                    onFocus={e => e.target.style.borderBottomColor = "#0f62fe"}
                    onBlur={e => e.target.style.borderBottomColor = "#8d8d8d"}
                />
                <button
                    type="submit"
                    style={{
                        background: "#0f62fe",
                        color: "#ffffff",
                        border: "none",
                        padding: "10px 16px",
                        fontSize: 13,
                        fontFamily: "'IBM Plex Sans', sans-serif",
                        cursor: "pointer"
                    }}
                >
                    Undang
                </button>
            </div>
            {message && (
                <p style={{ fontSize: 12, marginTop: 8, color: error ? "#da1e28" : "#42be65" }}>{message}</p>
            )}
        </form>
    )
}