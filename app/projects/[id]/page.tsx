import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import TaskCard from "./TaskCard"
import DeleteProjectButton from "./DeleteProjectButton"
import InviteMember from "./InviteMember"

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session) redirect("/login")

    const project = await prisma.project.findUnique({
        where: { id },
        include: {
            owner: true,
            members: { include: { user: true } },
            tasks: { include: { assignee: true } }
        }
    })

    if (!project) redirect("/dashboard")

    const allMembers = [project.owner, ...project.members.map((m: any) => m.user)]
    const isOwner = project.ownerId === session.user.id
    const doneTasks = project.tasks.filter((t: any) => t.status === "DONE").length
    const totalTasks = project.tasks.length
    const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

    const todoTasks = project.tasks.filter((t: any) => t.status === "TODO")
    const inProgressTasks = project.tasks.filter((t: any) => t.status === "IN_PROGRESS")
    const donedTasks = project.tasks.filter((t: any) => t.status === "DONE")

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono&display=swap');
        * { box-sizing: border-box; }
        body { background: #f4f4f4; margin: 0; }
        .task-col {
          background: #ffffff;
          border-top: 3px solid #e0e0e0;
          padding: 0;
          flex: 1;
          min-width: 0;
        }
        .task-col-header {
          padding: 16px 20px;
          border-bottom: 1px solid #e0e0e0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      `}</style>

            <div style={{ minHeight: "100vh", background: "#f4f4f4", fontFamily: "'IBM Plex Sans', sans-serif" }}>

                {/* Navbar */}
                <nav style={{ background: "#161616", padding: "0 48px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 48, borderBottom: "1px solid #393939" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <svg width="20" height="20" viewBox="0 0 32 32" fill="white">
                            <rect x="0" y="0" width="6" height="32" />
                            <rect x="8" y="6" width="6" height="20" />
                            <rect x="16" y="0" width="6" height="32" />
                            <rect x="24" y="6" width="8" height="4" />
                            <rect x="24" y="14" width="8" height="4" />
                            <rect x="24" y="22" width="8" height="4" />
                        </svg>
                        <span style={{ color: "#ffffff", fontSize: 14 }}>Projectum</span>
                    </div>
                    <Link href="/dashboard" style={{ color: "#8d8d8d", fontSize: 13, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="#8d8d8d">
                            <path d="M7.293 1.5L1.5 7.293l5.793 5.793 1.414-1.414L4.414 8H15V6H4.414l4.293-4.293z" />
                        </svg>
                        Dashboard
                    </Link>
                </nav>

                {/* Header */}
                <div style={{ background: "#ffffff", borderBottom: "1px solid #e0e0e0", padding: "40px 48px" }}>
                    <p style={{ color: "#6f6f6f", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8, fontFamily: "'IBM Plex Mono', monospace" }}>
                        Project
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ flex: 1, marginRight: 48 }}>
                            <h1 style={{ color: "#161616", fontSize: 36, fontWeight: 300, letterSpacing: "-0.01em", marginBottom: 8 }}>
                                {project.name}
                            </h1>
                            <p style={{ color: "#8d8d8d", fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
                                {project.description || "Tidak ada deskripsi"}
                            </p>
                            <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
                                {project.deadline && (
                                    <span style={{ color: "#da1e28", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" }}>
                                        Deadline: {new Date(project.deadline).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                                    </span>
                                )}
                                <span style={{ color: "#6f6f6f", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" }}>
                                    Owner: {project.owner.name}
                                </span>
                            </div>
                        </div>

                        <div style={{ textAlign: "right", minWidth: 160 }}>
                            <p style={{ color: "#0f62fe", fontSize: 48, fontWeight: 300, fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1 }}>
                                {pct}%
                            </p>
                            <p style={{ color: "#8d8d8d", fontSize: 12, marginTop: 4, marginBottom: 12 }}>
                                {doneTasks} dari {totalTasks} task selesai
                            </p>
                            <div style={{ background: "#e0e0e0", height: 2 }}>
                                <div style={{ background: "#0f62fe", height: 2, width: `${pct}%` }} />
                            </div>
                            {isOwner && (
                                <div style={{ marginTop: 16 }}>
                                    <DeleteProjectButton projectId={project.id} isOwner={isOwner} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div style={{ padding: "40px 48px" }}>

                    {/* Anggota */}
                    <div style={{ background: "#ffffff", borderTop: "3px solid #0f62fe", padding: "24px", marginBottom: 2 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 20 }}>
                            <div>
                                <p style={{ color: "#6f6f6f", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16, fontFamily: "'IBM Plex Mono', monospace" }}>
                                    Anggota Tim — {allMembers.length} orang
                                </p>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                    {allMembers.map(member => (
                                        <div key={member.id} style={{ display: "flex", alignItems: "center", gap: 8, background: "#f4f4f4", padding: "8px 16px" }}>
                                            <div style={{ width: 24, height: 24, background: "#0f62fe", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}>
                                                <span style={{ color: "#fff", fontSize: 11, fontWeight: 600 }}>
                                                    {member.name?.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <span style={{ color: "#161616", fontSize: 13 }}>{member.name}</span>
                                            {member.id === project.ownerId && (
                                                <span style={{ color: "#0f62fe", fontSize: 10, fontFamily: "'IBM Plex Mono', monospace" }}>OWNER</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {isOwner && (
                                <div style={{ minWidth: 280 }}>
                                    <p style={{ color: "#6f6f6f", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12, fontFamily: "'IBM Plex Mono', monospace" }}>
                                        Undang Anggota
                                    </p>
                                    <InviteMember projectId={project.id} isOwner={isOwner} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tasks Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 0 16px" }}>
                        <p style={{ color: "#6f6f6f", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace" }}>
                            Tasks — {totalTasks} total
                        </p>
                        <Link href={`/projects/${project.id}/tasks/new`} style={{
                            background: "#0f62fe",
                            color: "#ffffff",
                            textDecoration: "none",
                            padding: "10px 20px",
                            fontSize: 13,
                            display: "flex",
                            alignItems: "center",
                            gap: 8
                        }}>
                            <span>Tambah Task</span>
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="white">
                                <path d="M8.707 1.5l-1.414 1.414L10.586 6H1v2h9.586l-3.293 3.086 1.414 1.414L14.414 7z" />
                            </svg>
                        </Link>
                    </div>

                    {/* Kanban Columns */}
                    <div style={{ display: "flex", gap: 2 }}>
                        {[
                            { label: "Belum Mulai", tasks: todoTasks, color: "#8d8d8d", status: "TODO" },
                            { label: "Dikerjakan", tasks: inProgressTasks, color: "#f1c21b", status: "IN_PROGRESS" },
                            { label: "Selesai", tasks: donedTasks, color: "#42be65", status: "DONE" }
                        ].map(col => (
                            <div key={col.status} className="task-col">
                                <div className="task-col-header">
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
                                            <TaskCard key={task.id} task={task} projectId={project.id} />
                                        ))
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </>
    )
}