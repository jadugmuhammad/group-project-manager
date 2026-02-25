import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import LogoutButton from "../components/LogoutButton"

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

    const totalTasks = projects.reduce((acc: number, p: { tasks: { length: number } }) => acc + p.tasks.length, 0)
    const doneTasks = projects.reduce((acc: number, p: { tasks: { status: string }[] }) => acc + p.tasks.filter(t => t.status === "DONE").length, 0)

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
                        <span style={{ color: "#ffffff", fontSize: 14, fontWeight: 400 }}>Projectum</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                        <span style={{ color: "#8d8d8d", fontSize: 13 }}>{session.user.name}</span>
                        <LogoutButton />
                    </div>
                </nav>

                {/* Header */}
                <div style={{ background: "#ffffff", borderBottom: "1px solid #e0e0e0", padding: "40px 48px" }}>
                    <p style={{ color: "#6f6f6f", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8, fontFamily: "'IBM Plex Mono', monospace" }}>
                        Dashboard
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                        <h1 style={{ color: "#161616", fontSize: 36, fontWeight: 300, letterSpacing: "-0.01em" }}>
                            Selamat datang, {session.user.name?.split(" ")[0]}.
                        </h1>
                        <Link href="/projects/new" style={{
                            background: "#0f62fe",
                            color: "#ffffff",
                            textDecoration: "none",
                            padding: "12px 24px",
                            fontSize: 14,
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            transition: "background 0.1s"
                        }}>
                            <span>Buat Project</span>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                                <path d="M8.707 1.5l-1.414 1.414L10.586 6H1v2h9.586l-3.293 3.086 1.414 1.414L14.414 7z" />
                            </svg>
                        </Link>
                    </div>
                </div>

                <div style={{ padding: "40px 48px" }}>

                    {/* Stats */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, marginBottom: 40 }}>
                        <div className="stat-card">
                            <p style={{ color: "#6f6f6f", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12, fontFamily: "'IBM Plex Mono', monospace" }}>Total Project</p>
                            <p style={{ color: "#161616", fontSize: 40, fontWeight: 300 }}>{projects.length}</p>
                        </div>
                        <div className="stat-card">
                            <p style={{ color: "#6f6f6f", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12, fontFamily: "'IBM Plex Mono', monospace" }}>Total Task</p>
                            <p style={{ color: "#161616", fontSize: 40, fontWeight: 300 }}>{totalTasks}</p>
                        </div>
                        <div className="stat-card">
                            <p style={{ color: "#6f6f6f", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12, fontFamily: "'IBM Plex Mono', monospace" }}>Task Selesai</p>
                            <p style={{ color: "#161616", fontSize: 40, fontWeight: 300 }}>{doneTasks}</p>
                        </div>
                    </div>

                    {/* Project List */}
                    <div style={{ marginBottom: 24 }}>
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
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 2 }}>
                            {projects.map(project => {
                                const done = project.tasks.filter(t => t.status === "DONE").length
                                const total = project.tasks.length
                                const pct = total > 0 ? Math.round((done / total) * 100) : 0

                                return (
                                    <Link href={`/projects/${project.id}`} key={project.id} className="project-card">
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                                            <h3 style={{ color: "#161616", fontSize: 16, fontWeight: 500, lineHeight: 1.3 }}>{project.name}</h3>
                                            <span style={{ color: "#0f62fe", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "nowrap", marginLeft: 12 }}>
                                                {pct}%
                                            </span>
                                        </div>
                                        <p style={{ color: "#8d8d8d", fontSize: 13, lineHeight: 1.5, marginBottom: 20 }}>
                                            {project.description || "Tidak ada deskripsi"}
                                        </p>
                                        {/* Progress bar */}
                                        <div style={{ background: "#e0e0e0", height: 2, marginBottom: 16 }}>
                                            <div style={{ background: "#0f62fe", height: 2, width: `${pct}%`, transition: "width 0.3s" }} />
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