"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

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

export default function AddTaskButton({
    projectId,
    members,
    onTaskAdded
}: {
    projectId: string
    members: Member[]
    onTaskAdded: (task: Task) => void
}) {
    const [loading, setLoading] = useState(false)

    const handleAdd = async () => {
        setLoading(true)

        const res = await fetch(`/api/projects/${projectId}/tasks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: "Task baru" })
        })

        const data = await res.json()
        onTaskAdded({ ...data, assignee: null })
        setLoading(false)
    }

    return (
        <button
            onClick={handleAdd}
            disabled={loading}
            style={{
                background: loading ? "#8d8d8d" : "#0f62fe",
                color: "#ffffff",
                border: "none",
                padding: "9px 14px",
                fontSize: 13,
                fontFamily: "'IBM Plex Sans', sans-serif",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center"
            }}
        >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="white" style={{ marginBottom: 1 }}>
                <path d="M7 1v6H1v2h6v6h2V9h6V7H9V1z" />
            </svg>
        </button>
    )
}