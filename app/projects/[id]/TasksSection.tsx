"use client"

import { useState } from "react"
import TaskCard from "./TaskCard"
import AddTaskButton from "./AddTaskButton"

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

export default function TasksSection({
    projectId,
    initialTasks,
    members
}: {
    projectId: string
    initialTasks: Task[]
    members: Member[]
}) {
    const [tasks, setTasks] = useState<Task[]>(initialTasks)

    const handleTaskAdded = (newTask: Task) => {
        setTasks(prev => [...prev, newTask])
    }

    const handleTaskDeleted = (taskId: string) => {
        setTasks(prev => prev.filter(t => t.id !== taskId))
    }

    const handleTaskUpdated = (updatedTask: Task) => {
        setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t))
    }

    const todoTasks = tasks.filter(t => t.status === "TODO")
    const inProgressTasks = tasks.filter(t => t.status === "IN_PROGRESS")
    const doneTasks = tasks.filter(t => t.status === "DONE")

    return (
        <>
            <style>{`
        .kanban-board {
          display: flex;
          gap: 2px;
        }
        @media (max-width: 768px) {
          .kanban-board {
            flex-direction: column;
          }
        }
      `}</style>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 0 16px" }}>
                <p style={{ color: "#6f6f6f", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace" }}>
                    Tasks — {tasks.length} total
                </p>
            </div>

            <div className="kanban-board">
                {[
                    { label: "Belum Mulai", tasks: todoTasks, color: "#8d8d8d", status: "TODO" },
                    { label: "Dikerjakan", tasks: inProgressTasks, color: "#f1c21b", status: "IN_PROGRESS" },
                    { label: "Selesai", tasks: doneTasks, color: "#42be65", status: "DONE" }
                ].map(col => (
                    <div key={col.status} style={{ background: "#ffffff", borderTop: "3px solid #e0e0e0", flex: 1, minWidth: 0 }}>
                        <div style={{ padding: "16px 20px", borderBottom: "1px solid #e0e0e0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <div style={{ width: 8, height: 8, borderRadius: "50%", background: col.color }} />
                                <span style={{ color: "#161616", fontSize: 13, fontWeight: 500 }}>{col.label}</span>
                            </div>
                            <span style={{ color: "#8d8d8d", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" }}>
                                {col.tasks.length}
                            </span>
                        </div>
                        <div style={{ padding: "8px" }}>
                            {col.tasks.length === 0 ? (
                                <p style={{ color: "#c6c6c6", fontSize: 13, padding: "16px 12px", textAlign: "center" }}>Kosong</p>
                            ) : (
                                col.tasks.map((task: any) => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        projectId={projectId}
                                        members={members}
                                        onDeleted={handleTaskDeleted}
                                        onUpdated={handleTaskUpdated}
                                    />
                                ))
                            )}
                            {col.status === "TODO" && (
                                <div style={{ marginTop: 12 }}>
                                    <AddTaskButton
                                        projectId={projectId}
                                        members={members}
                                        onTaskAdded={handleTaskAdded}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}