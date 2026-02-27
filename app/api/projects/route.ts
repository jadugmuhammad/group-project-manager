import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { prisma } from "@/lib/prisma"
import { createNotification, createNotificationMany } from "@/lib/notifications"

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { id } = await params
    const body = await req.json()
    const { name, description, deadline, ownerId } = body

    const project = await prisma.project.findUnique({ where: { id } })
    if (!project) return NextResponse.json({ message: "Project tidak ditemukan" }, { status: 404 })
    if (project.ownerId !== session.user.id) return NextResponse.json({ message: "Hanya owner yang bisa mengedit project" }, { status: 403 })

    if (ownerId && ownerId !== project.ownerId) {
        try {
            const alreadyMember = await prisma.member.findFirst({
                where: { projectId: id, userId: project.ownerId }
            })
            if (!alreadyMember) {
                await prisma.member.create({
                    data: { projectId: id, userId: project.ownerId }
                })
            }
            await prisma.member.deleteMany({
                where: { projectId: id, userId: ownerId }
            })
            await createNotification({
                userId: ownerId,
                type: "NEW_OWNER",
                message: `Kamu dijadikan owner baru project "${project.name}"`,
                link: `/projects/${id}`
            })
        } catch (e) {
            console.error("Notification error:", e)
        }
    }

    const updated = await prisma.project.update({
        where: { id },
        data: {
            ...(name !== undefined && name !== "" && { name }),
            ...(description !== undefined && { description }),
            ...(deadline !== undefined && { deadline: deadline ? new Date(deadline) : null }),
            ...(ownerId !== undefined && ownerId !== "" && { ownerId })
        }
    })

    return NextResponse.json(updated)
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { id } = await params

    const project = await prisma.project.findUnique({ where: { id } })
    if (!project) return NextResponse.json({ message: "Project tidak ditemukan" }, { status: 404 })
    if (project.ownerId !== session.user.id) return NextResponse.json({ message: "Hanya owner yang bisa menghapus project" }, { status: 403 })

    try {
        const members = await prisma.member.findMany({ where: { projectId: id } })
        const memberIds = members.map(m => m.userId)

        if (memberIds.length > 0) {
            await createNotificationMany(
                memberIds.map(uid => ({
                    userId: uid,
                    type: "PROJECT_DELETED",
                    message: `Project "${project.name}" telah dihapus oleh owner`
                }))
            )
        }
    } catch (e) {
        console.error("Notification error:", e)
    }

    await prisma.task.deleteMany({ where: { projectId: id } })
    await prisma.member.deleteMany({ where: { projectId: id } })
    await prisma.project.delete({ where: { id } })

    return NextResponse.json({ message: "Project dihapus" })
}