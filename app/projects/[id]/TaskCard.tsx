"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import ConfirmModal from "../../components/ConfirmModal"

type Task = {
    id: string
    title: string
    description: string | null
    status: "TODO" | "IN_PROGRESS" | "DONE"
    deadline: Date | null
    assignee: { name: string | null } | null
}

export default function TaskCard({ task, projectId }: { task: Task; projectId: string }) {
    const router = useRouter()
    const [status, setStatus] = useState(task.status)
    const [loading, setLoading] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const handleStatusChange = async (newStatus: string) => {
        setLoading(true)
        await fetch(`/api/projects/${projectId}/tasks/${task.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus })
        })
        setStatus(newStatus as Task["status"])
        setLoading(false)
        router.refresh()
    }

    const handleDelete = async () => {
        setDeleting(true)
        setShowConfirm(false)
        await fetch(`/api/projects/${projectId}/tasks/${task.id}`, { method: "DELETE" })
        router.refresh()
    }

    return (
        <>
            {showConfirm && (
                <ConfirmModal
                    message={<>Hapus task "<strong>{task.title}</strong>"? Tindakan ini tidak dapat dibatalkan.</>}
                    onConfirm={handleDelete}
                    onCancel={() => setShowConfirm(false)}
                />
            )}

            <div style={{
                background: "#ffffff",
                border: "1px solid #e0e0e0",
                borderLeft: "3px solid #0f62fe",
                padding: "14px 16px",
                marginBottom: 4,
                opacity: deleting ? 0.5 : 1
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <p style={{ color: "#161616", fontSize: 14, fontWeight: 500, lineHeight: 1.4, flex: 1, marginRight: 8 }}>
                        {task.title}
                    </p>
                    <button
                        onClick={() => setShowConfirm(true)}
                        disabled={deleting}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#8d8d8d", padding: 0, fontSize: 18, lineHeight: 1 }}
                    >
                        ×
                    </button>
                </div>

                {task.assignee && (
                    <p style={{ color: "#8d8d8d", fontSize: 12, marginBottom: 10, fontFamily: "'IBM Plex Mono', monospace" }}>
                        → {task.assignee.name}
                    </p>
                )}

                {task.deadline && (
                    <p style={{ color: "#da1e28", fontSize: 11, marginBottom: 10, fontFamily: "'IBM Plex Mono', monospace" }}>
                        {new Date(task.deadline).toLocaleDateString("id-ID")}
                    </p>
                )}

                <select
                    value={status}
                    onChange={e => handleStatusChange(e.target.value)}
                    disabled={loading}
                    style={{
                        width: "100%",
                        background: "#f4f4f4",
                        border: "1px solid #e0e0e0",
                        padding: "6px 10px",
                        fontSize: 12,
                        color: "#161616",
                        fontFamily: "'IBM Plex Sans', sans-serif",
                        cursor: "pointer",
                        outline: "none"
                    }}
                >
                    <option value="TODO">Belum Mulai</option>
                    <option value="IN_PROGRESS">Dikerjakan</option>
                    <option value="DONE">Selesai</option>
                </select>
            </div>
        </>
    )
}