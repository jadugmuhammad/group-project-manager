"use client"

import { useState } from "react"
import ConfirmModal from "@/app/components/ConfirmModal"
import DatePicker from "@/app/components/DatePicker"
import TaskNotepad from "./TaskNotepad"

type Member = {
    id: string
    name: string | null
}

type Task = {
    id: string
    title: string
    description: string | null
    notes: string | null
    status: "TODO" | "IN_PROGRESS" | "DONE"
    deadline: Date | null
    assigneeId: string | null
    assignee: { id: string; name: string | null } | null
}

export default function TaskCard({
    task,
    projectId,
    members,
    onDeleted,
    onUpdated
}: {
    task: Task
    projectId: string
    members: Member[]
    onDeleted: (id: string) => void
    onUpdated: (task: Task) => void
}) {
    const [data, setData] = useState(task)
    const [editingTitle, setEditingTitle] = useState(false)
    const [titleValue, setTitleValue] = useState(task.title)
    const [showConfirm, setShowConfirm] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [saving, setSaving] = useState(false)
    const [notes, setNotes] = useState(task.notes || "")
    const [editingNotes, setEditingNotes] = useState(false)

    const updateTask = async (fields: Partial<Task>) => {
        setSaving(true)
        const updated = { ...data, ...fields }
        setData(updated)
        onUpdated(updated)

        await fetch(`/api/projects/${projectId}/tasks/${task.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                status: updated.status,
                title: updated.title,
                deadline: updated.deadline ? new Date(updated.deadline).toISOString() : null,
                assigneeId: updated.assigneeId || null
            })
        })
        setSaving(false)
    }

    const handleTitleBlur = async () => {
        setEditingTitle(false)
        if (titleValue.trim() && titleValue !== data.title) {
            await updateTask({ title: titleValue.trim() })
        }
    }

    const handleDelete = async () => {
        setDeleting(true)
        setShowConfirm(false)
        await fetch(`/api/projects/${projectId}/tasks/${task.id}`, { method: "DELETE" })
        onDeleted(task.id)
    }

    const deadlineString = data.deadline
        ? new Date(data.deadline).toISOString()
        : ""

    return (
        <>
            {showConfirm && (
                <ConfirmModal
                    message={<>Hapus task "<strong>{data.title}</strong>"? Tindakan ini tidak dapat dibatalkan.</>}
                    onConfirm={handleDelete}
                    onCancel={() => setShowConfirm(false)}
                />
            )}

            <div style={{
                background: "#ffffff",
                border: "1px solid #e0e0e0",
                borderLeft: `3px solid ${saving ? "#f1c21b" : "#0f62fe"}`,
                padding: "14px 16px",
                marginBottom: 4,
                opacity: deleting ? 0.5 : 1,
                transition: "border-left-color 0.2s"
            }}>

                {/* Title */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    {editingTitle ? (
                        <input
                            autoFocus
                            value={titleValue}
                            onChange={e => setTitleValue(e.target.value)}
                            onBlur={handleTitleBlur}
                            onKeyDown={e => e.key === "Enter" && handleTitleBlur()}
                            style={{
                                flex: 1,
                                border: "none",
                                borderBottom: "2px solid #0f62fe",
                                outline: "none",
                                fontSize: 14,
                                fontWeight: 500,
                                fontFamily: "'IBM Plex Sans', sans-serif",
                                color: "#161616",
                                background: "transparent",
                                marginRight: 8,
                                padding: "2px 0"
                            }}
                        />
                    ) : (
                        <p
                            onClick={() => setEditingTitle(true)}
                            style={{
                                color: "#161616",
                                fontSize: 14,
                                fontWeight: 500,
                                lineHeight: 1.4,
                                flex: 1,
                                marginRight: 8,
                                cursor: "text"
                            }}
                        >
                            {data.title}
                        </p>
                    )}
                    <button
                        onClick={() => setShowConfirm(true)}
                        disabled={deleting}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#8d8d8d", padding: 0, fontSize: 18, lineHeight: 1 }}
                    >
                        ×
                    </button>
                </div>

                {/* Assignee */}
                <div style={{ marginBottom: 10 }}>
                    <select
                        value={data.assigneeId || ""}
                        onChange={e => {
                            const assigneeId = e.target.value || null
                            const assignee = members.find(m => m.id === assigneeId) || null
                            updateTask({ assigneeId, assignee: assignee ? { id: assignee.id, name: assignee.name } : null })
                        }}
                        style={{
                            width: "100%",
                            background: "transparent",
                            border: "none",
                            borderBottom: "1px solid #e0e0e0",
                            padding: "4px 0",
                            fontSize: 12,
                            color: data.assigneeId ? "#161616" : "#a8a8a8",
                            fontFamily: "'IBM Plex Mono', monospace",
                            outline: "none",
                            cursor: "pointer"
                        }}
                    >
                        <option value="">— Belum di-assign —</option>
                        {members.map(m => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                    </select>
                </div>

                {/* Deadline */}
                <div style={{ marginBottom: 10 }}>
                    <DatePicker
                        value={deadlineString}
                        onChange={date => updateTask({ deadline: date ? new Date(date) : null })}
                        placeholder="Tambah deadline"
                        showTime={true}
                    />
                </div>

                {/* Status */}
                <select
                    value={data.status}
                    onChange={e => updateTask({ status: e.target.value as Task["status"] })}
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

                {/* Notepad */}
                <TaskNotepad
                    initialNotes={data.notes || ""}
                    onSave={async (notes) => {
                        await updateTask({ notes })
                    }}
                />

            </div>
        </>
    )
}