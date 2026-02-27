import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createNotificationMany } from "@/lib/notifications"

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const now = new Date()
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000)

    // Cari project yang deadline dalam 24 jam ke depan
    const soonProjects = await prisma.project.findMany({
        where: {
            deadline: { gte: now, lte: in24h }
        },
        include: { members: true }
    })

    // Cari project yang sudah overdue
    const overdueProjects = await prisma.project.findMany({
        where: {
            deadline: { lt: now },
            tasks: { some: { status: { not: "DONE" } } }
        },
        include: { members: true }
    })

    for (const project of soonProjects) {
        const userIds = [project.ownerId, ...project.members.map(m => m.userId)]
        const uniqueIds = [...new Set(userIds)]

        // Cek apakah sudah pernah dapat notifikasi "hampir overdue" hari ini
        const existing = await prisma.notification.findFirst({
            where: {
                type: "DEADLINE_SOON",
                referenceId: project.id,
                createdAt: { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) }
            }
        })
        if (existing) continue

        await createNotificationMany(
            uniqueIds.map(uid => ({
                userId: uid,
                type: "DEADLINE_SOON",
                message: `Deadline project "${project.name}" kurang dari 24 jam lagi!`,
                link: `/projects/${project.id}`,
                referenceId: project.id
            }))
        )
    }

    for (const project of overdueProjects) {
        const userIds = [project.ownerId, ...project.members.map(m => m.userId)]
        const uniqueIds = [...new Set(userIds)]

        // Cek apakah sudah pernah dapat notifikasi "overdue" hari ini
        const existing = await prisma.notification.findFirst({
            where: {
                type: "DEADLINE_OVERDUE",
                referenceId: project.id,
                createdAt: { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) }
            }
        })
        if (existing) continue

        await createNotificationMany(
            uniqueIds.map(uid => ({
                userId: uid,
                type: "DEADLINE_OVERDUE",
                message: `Project "${project.name}" sudah melewati deadline!`,
                link: `/projects/${project.id}`,
                referenceId: project.id
            }))
        )
    }

    return NextResponse.json({ message: "Cron selesai" })
}