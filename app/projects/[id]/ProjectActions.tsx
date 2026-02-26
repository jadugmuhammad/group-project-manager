"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import ConfirmModal from "@/app/components/ConfirmModal"

type Member = {
    id: string
    name: string | null
}

export default function ProjectActions({
    projectId,
    isOwner,
    members,
    currentUserId
}: {
    projectId: string
    isOwner: boolean
    members: Member[]
    currentUserId: string
}) {
    const router = useRouter()
    const [showDelete, setShowDelete] = useState(false)
    const [showLeave, setShowLeave] = useState(false)
    const [showPickOwner, setShowPickOwner] = useState(false)
    const [newOwnerId, setNewOwnerId] = useState(members[0]?.id || "")
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        setLoading(true)
        await fetch(`/api/projects/${projectId}`, { method: "DELETE" })
        router.push("/dashboard")
    }

    const handleLeave = async () => {
        if (isOwner) {
            setShowLeave(false)
            setShowPickOwner(true)
            return
        }
        setLoading(true)
        await fetch(`/api/projects/${projectId}/members`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: currentUserId })
        })
        router.push("/dashboard")
    }

    const handleLeaveWithNewOwner = async () => {
        if (!newOwnerId) return
        setLoading(true)

        await fetch(`/api/projects/${projectId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ownerId: newOwnerId })
        })

        router.push("/dashboard")
    }

    const canLeave = !isOwner || members.length > 0

    return (
        <>
            {showDelete && (
                <ConfirmModal
                    message="Hapus project ini? Semua task akan ikut terhapus dan tindakan ini tidak dapat dibatalkan."
                    onConfirm={handleDelete}
                    onCancel={() => setShowDelete(false)}
                    confirmLabel="Hapus"
                />
            )}

            {showLeave && (
                <ConfirmModal
                    message="Keluar dari project ini?"
                    onConfirm={handleLeave}
                    onCancel={() => setShowLeave(false)}
                    confirmLabel="Keluar"
                    confirmColor="#393939"
                />
            )}

            {showPickOwner && (
                <div style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000,
                    fontFamily: "'IBM Plex Sans', sans-serif"
                }}>
                    <div style={{ background: "#ffffff", width: "100%", maxWidth: 480, borderTop: "3px solid #393939" }}>
                        <div style={{ padding: "40px 32px", borderBottom: "1px solid #e0e0e0" }}>
                            <p style={{ color: "#6f6f6f", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8, fontFamily: "'IBM Plex Mono', monospace" }}>
                                Konfirmasi
                            </p>
                            <p style={{ color: "#161616", fontSize: 16, lineHeight: 1.5, marginBottom: 20 }}>
                                Pilih owner baru sebelum keluar dari project.
                            </p>
                            <select
                                value={newOwnerId}
                                onChange={e => setNewOwnerId(e.target.value)}
                                style={{
                                    width: "100%",
                                    background: "#f4f4f4",
                                    border: "none",
                                    borderBottom: "2px solid #8d8d8d",
                                    padding: "12px 16px",
                                    fontSize: 14,
                                    fontFamily: "'IBM Plex Sans', sans-serif",
                                    color: "#161616",
                                    outline: "none"
                                }}
                            >
                                {members.map(m => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </select>
                        </div>
                        <div style={{ padding: "16px 32px", display: "flex", justifyContent: "flex-end", gap: 2 }}>
                            <button
                                onClick={() => setShowPickOwner(false)}
                                style={{
                                    background: "transparent",
                                    border: "1px solid #8d8d8d",
                                    color: "#525252",
                                    padding: "10px 24px",
                                    fontSize: 14,
                                    fontFamily: "'IBM Plex Sans', sans-serif",
                                    cursor: "pointer"
                                }}
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleLeaveWithNewOwner}
                                disabled={loading || !newOwnerId}
                                style={{
                                    background: loading ? "#8d8d8d" : "#393939",
                                    border: "none",
                                    color: "#ffffff",
                                    padding: "10px 24px",
                                    fontSize: 14,
                                    fontFamily: "'IBM Plex Sans', sans-serif",
                                    cursor: loading ? "not-allowed" : "pointer"
                                }}
                            >
                                Keluar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: "flex", gap: 2 }}>
                {isOwner && (
                    <button
                        onClick={() => setShowDelete(true)}
                        style={{
                            background: "transparent",
                            border: "1px solid #da1e28",
                            color: "#da1e28",
                            padding: "6px 16px",
                            fontSize: 12,
                            fontFamily: "'IBM Plex Sans', sans-serif",
                            cursor: "pointer"
                        }}
                    >
                        Hapus Project
                    </button>
                )}
                {canLeave && (
                    <button
                        onClick={() => setShowLeave(true)}
                        style={{
                            background: "transparent",
                            border: "1px solid #8d8d8d",
                            color: "#525252",
                            padding: "6px 16px",
                            fontSize: 12,
                            fontFamily: "'IBM Plex Sans', sans-serif",
                            cursor: "pointer"
                        }}
                    >
                        Keluar Project
                    </button>
                )}
            </div>
        </>
    )
}