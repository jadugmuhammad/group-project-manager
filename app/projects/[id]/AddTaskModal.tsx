"use client"

import { useState } from "react"
import DatePicker from "@/app/components/DatePicker"

type Member = {
    id: string
    name: string | null
}

type Task = {
    id: string
    title: string
    description: string | null
    status: "TODO" | "IN_PROGRESS" | "DONE"
    deadline: Date | null
    assigneeId: string | null
    assignee: { id: string; name: string | null } | null
}

export default function AddTaskModal({
    projectId,
    members,
    onClose,
    onTaskAdded
}: {
    projectId: string
    members: Member[]
    onClose: () => void
    onTaskAdded: (task: Task) => void
}) {
    const [form, setForm] = useState({ title: "", description: "", deadline: "", assigneeId: "" })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        const res = await fetch(`/api/projects/${projectId}/tasks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        })

        const data = await res.json()

        if (!res.ok) {
            setError(data.message)
            setLoading(false)
            return
        }

        const assignee = members.find(m => m.id === form.assigneeId) || null
        onTaskAdded({
            ...data,
            assignee: assignee ? { id: assignee.id, name: assignee.name } : null
        })
    }

    return (
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
            <div style={{ background: "#ffffff", width: "100%", maxWidth: 520, borderTop: "3px solid #0f62fe" }}>

                <div style={{ padding: "24px 32px", borderBottom: "1px solid #e0e0e0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <p style={{ color: "#6f6f6f", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4, fontFamily: "'IBM Plex Mono', monospace" }}>
                            Task Baru
                        </p>
                        <h2 style={{ color: "#161616", fontSize: 20, fontWeight: 400 }}>Tambah task</h2>
                    </div>
                    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#8d8d8d", fontSize: 24, lineHeight: 1, padding: 0 }}>
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: 20 }}>

                        <div>
                            <label style={{ display: "block", color: "#525252", fontSize: 12, fontWeight: 500, marginBottom: 8 }}>
                                Judul Task <span style={{ color: "#da1e28" }}>*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Masukkan judul task"
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                                required
                                style={{
                                    width: "100%",
                                    background: "#f4f4f4",
                                    border: "none",
                                    borderBottom: "2px solid #8d8d8d",
                                    padding: "12px 16px",
                                    fontSize: 14,
                                    fontFamily: "'IBM Plex Sans', sans-serif",
                                    color: "#161616",
                                    outline: "none",
                                    boxSizing: "border-box"
                                }}
                                onFocus={e => e.target.style.borderBottomColor = "#0f62fe"}
                                onBlur={e => e.target.style.borderBottomColor = "#8d8d8d"}
                            />
                        </div>

                        <div>
                            <label style={{ display: "block", color: "#525252", fontSize: 12, fontWeight: 500, marginBottom: 8 }}>
                                Deskripsi
                            </label>
                            <textarea
                                placeholder="Jelaskan detail task ini"
                                rows={3}
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                style={{
                                    width: "100%",
                                    background: "#f4f4f4",
                                    border: "none",
                                    borderBottom: "2px solid #8d8d8d",
                                    padding: "12px 16px",
                                    fontSize: 14,
                                    fontFamily: "'IBM Plex Sans', sans-serif",
                                    color: "#161616",
                                    outline: "none",
                                    resize: "none",
                                    boxSizing: "border-box"
                                }}
                                onFocus={e => e.target.style.borderBottomColor = "#0f62fe"}
                                onBlur={e => e.target.style.borderBottomColor = "#8d8d8d"}
                            />
                        </div>

                        <div>
                            <label style={{ display: "block", color: "#525252", fontSize: 12, fontWeight: 500, marginBottom: 8 }}>
                                Deadline
                            </label>
                            <DatePicker
                                value={form.deadline}
                                onChange={date => setForm({ ...form, deadline: date })}
                                placeholder="Pilih deadline"
                            />
                        </div>

                        <div>
                            <label style={{ display: "block", color: "#525252", fontSize: 12, fontWeight: 500, marginBottom: 8 }}>
                                Assign ke
                            </label>
                            <select
                                value={form.assigneeId}
                                onChange={e => setForm({ ...form, assigneeId: e.target.value })}
                                style={{
                                    width: "100%",
                                    background: "#f4f4f4",
                                    border: "none",
                                    borderBottom: "2px solid #8d8d8d",
                                    padding: "12px 16px",
                                    fontSize: 14,
                                    fontFamily: "'IBM Plex Sans', sans-serif",
                                    color: "#161616",
                                    outline: "none",
                                    cursor: "pointer",
                                    boxSizing: "border-box"
                                }}
                            >
                                <option value="">— Pilih anggota —</option>
                                {members.map(member => (
                                    <option key={member.id} value={member.id}>{member.name}</option>
                                ))}
                            </select>
                        </div>

                        {error && (
                            <div style={{ padding: "12px 16px", background: "#fff1f1", borderLeft: "3px solid #da1e28" }}>
                                <p style={{ color: "#da1e28", fontSize: 13, margin: 0 }}>{error}</p>
                            </div>
                        )}

                    </div>

                    <div style={{ padding: "16px 32px", borderTop: "1px solid #e0e0e0", display: "flex", justifyContent: "flex-end", gap: 2 }}>
                        <button
                            type="button"
                            onClick={onClose}
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
                            type="submit"
                            disabled={loading}
                            style={{
                                background: loading ? "#8d8d8d" : "#0f62fe",
                                border: "none",
                                color: "#ffffff",
                                padding: "10px 24px",
                                fontSize: 14,
                                fontFamily: "'IBM Plex Sans', sans-serif",
                                cursor: loading ? "not-allowed" : "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 8
                            }}
                        >
                            <span>{loading ? "Menyimpan..." : "Simpan Task"}</span>
                            {!loading && (
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="white">
                                    <path d="M8.707 1.5l-1.414 1.414L10.586 6H1v2h9.586l-3.293 3.086 1.414 1.414L14.414 7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}