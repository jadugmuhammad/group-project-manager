import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Navbar from "@/app/components/Navbar"
import ProjectHeader from "./ProjectHeader"
import TasksSection from "./TasksSection"
import DeleteProjectButton from "./DeleteProjectButton"
import InviteMember from "./InviteMember"
import MembersSection from "./MembersSection"

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

    const allMembers = [
        project.owner,
        ...project.members
            .map((m: any) => m.user)
            .filter((u: any) => u.id !== project.owner.id)
    ]
    const isOwner = project.ownerId === session.user.id
    const doneTasks = project.tasks.filter((t: any) => t.status === "DONE").length
    const totalTasks = project.tasks.length
    const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono&display=swap');
                * { box-sizing: border-box; }
                body { background: #f4f4f4; margin: 0; }
                .nav-inner { padding: 0 48px; }
                .page-inner { padding: 40px 48px; }
                .header-inner { padding: 40px 48px; }
                .header-content { display: flex; justify-content: space-between; align-items: flex-start; }
                .header-left { flex: 1; margin-right: 48px; }
                .header-right { text-align: right; min-width: 160px; }
                .members-row { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 20px; }
                .invite-section { min-width: 280px; }
                @media (max-width: 768px) {
                  .nav-inner { padding: 0 20px; }
                  .page-inner { padding: 24px 16px; }
                  .header-inner { padding: 24px 16px; }
                  .header-content { flex-direction: column; gap: 24px; }
                  .header-left { margin-right: 0; }
                  .header-right { text-align: left; min-width: unset; width: 100%; }
                  .header-title { font-size: 24px !important; }
                  .members-row { flex-direction: column; }
                  .invite-section { min-width: unset; width: 100%; }
                }
            `}</style>

            <div style={{ minHeight: "100vh", background: "#f4f4f4", fontFamily: "'IBM Plex Sans', sans-serif" }}>

                {/* Navbar */}
                <Navbar
                    path={[
                        { label: "Dashboard", href: "/dashboard" },
                        { label: project.name }
                    ]}
                    user={{ name: session.user.name, email: session.user.email }}
                />

                {/* Header */}
                <ProjectHeader
                    project={project}
                    isOwner={isOwner}
                    doneTasks={doneTasks}
                    totalTasks={totalTasks}
                    pct={pct}
                    members={allMembers.map(m => ({ id: m.id, name: m.name }))}
                    currentUserId={session.user.id}
                />

                <div className="page-inner">

                    {/* Anggota */}
                    <MembersSection
                        projectId={project.id}
                        ownerId={project.ownerId}
                        currentUserId={session.user.id}
                        initialMembers={allMembers.map(m => ({ id: m.id, name: m.name }))}
                    />

                    {/* Tasks */}
                    <TasksSection
                        projectId={project.id}
                        initialTasks={project.tasks.map((t: any) => ({
                            ...t,
                            assignee: t.assignee ? { id: t.assignee.id, name: t.assignee.name } : null,
                            notes: t.notes || null
                        }))}
                        members={allMembers.map(m => ({ id: m.id, name: m.name }))}
                    />

                </div>
            </div>
        </>
    )
}