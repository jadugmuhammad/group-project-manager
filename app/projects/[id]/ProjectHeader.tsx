"use client"

import { useState, useRef, useEffect } from "react"
import DatePicker from "@/app/components/DatePicker"
import ProjectActions from "./ProjectActions"

type Member = {
    id: string
    name: string | null
}

type Props = {
    project: {
        id: string
        name: string
        description: string | null
        deadline: Date | null
        ownerId: string
        owner: { id: string; name: string | null }
    }
    isOwner: boolean
    doneTasks: number
    totalTasks: number
    pct: number
    members: Member[]
    currentUserId: string
}

export default function ProjectHeader({ project, isOwner, doneTasks, totalTasks, pct, members, currentUserId }: Props) {
    const [name, setName] = useState(project.name)
    const [description, setDescription] = useState(project.description || "")
    const [deadline, setDeadline] = useState(
        project.deadline ? new Date(project.deadline).toISOString() : ""
    )
    const [editingDescription, setEditingDescription] = useState(false)
    const [editingDeadline, setEditingDeadline] = useState(false)
    const [savingName, setSavingName] = useState(false)

    const deadlineRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (deadlineRef.current && !deadlineRef.current.contains(e.target as Node)) {
                setEditingDeadline(false)
            }
        }
        if (editingDeadline) document.addEventListener("mousedown", handleClick)
        return () => document.removeEventListener("mousedown", handleClick)
    }, [editingDeadline])

    const updateProject = async (fields: { name?: string; description?: string; deadline?: string | null }) => {
        await fetch(`/api/projects/${project.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(fields)
        })
    }

    const now = new Date()
    const deadlineDate = deadline ? new Date(deadline) : null
    const isOverdue = deadlineDate && deadlineDate < now && doneTasks < totalTasks

    return (
        <div style={{ background: "#ffffff", borderBottom: "1px solid #e0e0e0" }}>
            <div className="header-inner">
                <p style={{ color: "#6f6f6f", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8, fontFamily: "'IBM Plex Mono', monospace" }}>
                    Project
                </p>
                <div className="header-content">
                    <div className="header-left">

                        {/* Nama Project */}
                        {isOwner ? (
                            <input
                                value={name}
                                onChange={e => setName(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                                style={{
                                    color: "#161616",
                                    fontSize: 36,
                                    fontWeight: 300,
                                    letterSpacing: "-0.01em",
                                    marginBottom: 12,
                                    border: "none",
                                    borderBottom: savingName ? "2px solid #f1c21b" : "2px solid transparent",
                                    outline: "none",
                                    background: "transparent",
                                    fontFamily: "'IBM Plex Sans', sans-serif",
                                    width: "100%",
                                    padding: "2px 0",
                                    transition: "border-bottom-color 0.2s"
                                }}
                                onFocus={e => e.target.style.borderBottomColor = "#0f62fe"}
                                onBlur={async e => {
                                    e.target.style.borderBottomColor = "transparent"
                                    if (name.trim() && name !== project.name) {
                                        setSavingName(true)
                                        await updateProject({ name: name.trim() })
                                        setSavingName(false)
                                    }
                                }}
                            />
                        ) : (
                            <h1 style={{ color: "#161616", fontSize: 36, fontWeight: 300, letterSpacing: "-0.01em", marginBottom: 12 }}>
                                {name}
                            </h1>
                        )}

                        {/* Deskripsi */}
                        {isOwner ? (
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                onFocus={() => setEditingDescription(true)}
                                onBlur={async e => {
                                    setEditingDescription(false)
                                    e.target.style.borderBottomColor = "transparent"
                                    if (description !== (project.description || "")) await updateProject({ description })
                                }}
                                placeholder="Tambah deskripsi..."
                                rows={2}
                                spellCheck={editingDescription}
                                style={{
                                    color: "#8d8d8d",
                                    fontSize: 14,
                                    lineHeight: 1.6,
                                    marginBottom: 16,
                                    border: "none",
                                    borderBottom: "2px solid transparent",
                                    outline: "none",
                                    background: "transparent",
                                    fontFamily: "'IBM Plex Sans', sans-serif",
                                    width: "100%",
                                    resize: "none",
                                    padding: "2px 0",
                                    transition: "border-bottom-color 0.2s"
                                }}
                            />
                        ) : (
                            <p style={{ color: "#8d8d8d", fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
                                {description || "Tidak ada deskripsi"}
                            </p>
                        )}

                        {/* Deadline */}
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }} ref={deadlineRef}>
                            <span style={{ color: "#6f6f6f", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" }}>
                                Deadline:
                            </span>

                            {isOwner && editingDeadline ? (
                                <div style={{ flex: 1, maxWidth: 240 }}>
                                    <DatePicker
                                        value={deadline}
                                        onChange={date => {
                                            setDeadline(date)
                                            updateProject({ deadline: date || null })
                                            setEditingDeadline(false)
                                        }}
                                        placeholder="Tidak ditentukan"
                                        showTime={true}
                                    />
                                </div>
                            ) : (
                                <span style={{ color: isOverdue ? "#da1e28" : deadlineDate ? "#525252" : "#a8a8a8", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" }}>
                                    {deadlineDate
                                        ? deadlineDate.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) +
                                        " " + deadlineDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
                                        : "Tidak ditentukan"
                                    }
                                </span>
                            )}

                            {isOverdue && !editingDeadline && (
                                <span style={{ color: "#da1e28", fontSize: 11, fontFamily: "'IBM Plex Mono', monospace" }}>
                                    OVERDUE
                                </span>
                            )}

                            {isOwner && !editingDeadline && (
                                <button
                                    onClick={() => setEditingDeadline(true)}
                                    style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 4px", color: "#8d8d8d", display: "flex", alignItems: "center" }}
                                >
                                    <svg width="12" height="12" viewBox="0 0 16 16" fill="#8d8d8d">
                                        <path d="M13.23 1a2.4 2.4 0 0 0-1.68.69L2 11.24V14h2.76l9.55-9.55a2.38 2.38 0 0 0 0-3.36A2.4 2.4 0 0 0 13.23 1zm-9 11.5H3v-1.23l7.84-7.84 1.23 1.23zm8.55-8.55-.71.71-1.23-1.23.71-.71a.89.89 0 0 1 1.23 1.23z" />
                                    </svg>
                                </button>
                            )}
                        </div>

                    </div>

                    <div className="header-right">
                        <p style={{ color: "#0f62fe", fontSize: 48, fontWeight: 300, fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1 }}>
                            {pct}%
                        </p>
                        <p style={{ color: "#8d8d8d", fontSize: 12, marginTop: 4, marginBottom: 12 }}>
                            {doneTasks} dari {totalTasks} task selesai
                        </p>
                        <div style={{ background: "#e0e0e0", height: 2 }}>
                            <div style={{ background: "#0f62fe", height: 2, width: `${pct}%` }} />
                        </div>
                        <div style={{ marginTop: 16 }}>
                            <ProjectActions
                                projectId={project.id}
                                isOwner={isOwner}
                                members={members.filter(m => m.id !== currentUserId)}
                                currentUserId={currentUserId}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}