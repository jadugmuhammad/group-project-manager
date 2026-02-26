import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Navbar from "@/app/components/Navbar"
import Link from "next/link"
import NewProjectButton from "./NewProjectButton"

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    const projects = await prisma.project.findMany({
        where: {
            OR: [
                { ownerId: session.user.id },
                { members: { some: { userId: session.user.id } } }
            ]
        },
        include: {
            owner: true,
            members: true,
            tasks: true
        }
    })

    let totalTasks = 0
    let doneTasks = 0
    for (const p of projects) {
        totalTasks += p.tasks.length
        doneTasks += p.tasks.filter((t: { status: string }) => t.status === "DONE").length
    }

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono&display=swap');
        * { box-sizing: border-box; }
        body { background: #f4f4f4; margin: 0; }
        .project-card {
          background: #ffffff;
          border-top: 3px solid #e0e0e0;
          padding: 24px;
          text-decoration: none;
          display: block;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .project-card:hover {
          border-top-color: #0f62fe;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        }
        .stat-card {
          background: #ffffff;
          padding: 24px;
          border-left: 3px solid #0f62fe;
        }
        .nav-inner {
          padding: 0 48px;
        }
        .main-inner {
          padding: 40px 48px;
        }
        .header-inner {
          padding: 40px 48px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
          margin-bottom: 40px;
        }
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 16px;
        }
        @media (max-width: 768px) {
          .nav-inner { padding: 0 20px; }
          .main-inner { padding: 24px 20px; }
          .header-inner { padding: 24px 20px; }
          .stats-grid { grid-template-columns: repeat(3, 1fr); gap: 2px; }
          .stat-card { padding: 16px; }
          .stat-card p:last-child { font-size: 28px !important; }
          .projects-grid { grid-template-columns: 1fr; }
          .header-title { font-size: 24px !important; }
          .new-project-btn span { display: none; }
        }
      `}</style>

            <div style={{ minHeight: "100vh", background: "#f4f4f4", fontFamily: "'IBM Plex Sans', sans-serif" }}>

                {/* Navbar */}
                <Navbar
                    path={[{ label: "Dashboard" }]}
                    user={{ name: session.user.name, email: session.user.email }}
                />

                {/* Header */}
                <div style={{ background: "#ffffff", borderBottom: "1px solid #e0e0e0" }}>
                    <div className="header-inner">
                        <p style={{ color: "#6f6f6f", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8, fontFamily: "'IBM Plex Mono', monospace" }}>
                            Dashboard
                        </p>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16 }}>
                            <h1 className="header-title" style={{ color: "#161616", fontSize: 36, fontWeight: 300, letterSpacing: "-0.01em" }}>
                                Selamat datang, {session.user.name?.split(" ")[0]}.
                            </h1>
                            <NewProjectButton />
                        </div>
                    </div>
                </div>

                <div className="main-inner">

                    {/* Stats */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <p style={{ color: "#6f6f6f", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12, fontFamily: "'IBM Plex Mono', monospace" }}>Total Project</p>
                            <p style={{ color: "#161616", fontSize: 40, fontWeight: 300 }}>{projects.length}</p>
                        </div>
                        <div className="stat-card">
                            <p style={{ color: "#6f6f6f", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12, fontFamily: "'IBM Plex Mono', monospace" }}>Total Task</p>
                            <p style={{ color: "#161616", fontSize: 40, fontWeight: 300 }}>{totalTasks}</p>
                        </div>
                        <div className="stat-card">
                            <p style={{ color: "#6f6f6f", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12, fontFamily: "'IBM Plex Mono', monospace" }}>Selesai</p>
                            <p style={{ color: "#161616", fontSize: 40, fontWeight: 300 }}>{doneTasks}</p>
                        </div>
                    </div>

                    {/* Project List */}
                    <div style={{ marginBottom: 16 }}>
                        <p style={{ color: "#6f6f6f", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace" }}>
                            Project Anda — {projects.length} total
                        </p>
                    </div>

                    {projects.length === 0 ? (
                        <div style={{ background: "#ffffff", padding: "64px 48px", textAlign: "center", borderTop: "3px solid #e0e0e0" }}>
                            <p style={{ color: "#161616", fontSize: 20, fontWeight: 300, marginBottom: 8 }}>Belum ada project.</p>
                            <p style={{ color: "#8d8d8d", fontSize: 14 }}>Mulai dengan membuat project baru.</p>
                        </div>
                    ) : (
                        <div className="projects-grid">
                            {(projects as any[]).map((project) => {
                                const done = project.tasks.filter((t: { status: string }) => t.status === "DONE").length
                                const total = project.tasks.length
                                const pct = total > 0 ? Math.round((done / total) * 100) : 0

                                return (
                                    <Link href={`/projects/${project.id}`} key={project.id} className="project-card">
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                                            <h3 style={{ color: "#161616", fontSize: 16, fontWeight: 500, lineHeight: 1.3 }}>{project.name}</h3>
                                            <span style={{ color: "#0f62fe", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "nowrap", marginLeft: 12 }}>
                                                {pct}%
                                            </span>
                                        </div>
                                        {(() => {
                                            const now = new Date()
                                            const deadline = project.deadline ? new Date(project.deadline) : null
                                            const isOverdue = deadline && deadline < now && project.tasks.filter((t: any) => t.status === "DONE").length < project.tasks.length

                                            return (
                                                <p style={{ color: isOverdue ? "#da1e28" : deadline ? "#525252" : "#a8a8a8", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", marginBottom: 12 }}>
                                                    {deadline
                                                        ? `Deadline: ${deadline.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}${isOverdue ? " — OVERDUE" : ""}`
                                                        : "Deadline: Tidak ditentukan"
                                                    }
                                                </p>
                                            )
                                        })()}
                                        <p style={{ color: "#8d8d8d", fontSize: 13, lineHeight: 1.5, marginBottom: 20 }}>
                                            {project.description || "Tidak ada deskripsi"}
                                        </p>
                                        <div style={{ background: "#e0e0e0", height: 2, marginBottom: 16 }}>
                                            <div style={{ background: "#0f62fe", height: 2, width: `${pct}%` }} />
                                        </div>
                                        <div style={{ display: "flex", gap: 16 }}>
                                            <span style={{ color: "#6f6f6f", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" }}>
                                                {project.members.length + 1} anggota
                                            </span>
                                            <span style={{ color: "#6f6f6f", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" }}>
                                                {done}/{total} task
                                            </span>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}