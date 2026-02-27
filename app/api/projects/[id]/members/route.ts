import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { prisma } from "@/lib/prisma"
import { createNotification, createNotificationMany } from "@/lib/notifications"

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { id } = await params

    const project = await prisma.project.findUnique({
        where: { id },
        include: {
            owner: true,
            members: { include: { user: true } }
        }
    })

    if (!project) return NextResponse.json({ message: "Project tidak ditemukan" }, { status: 404 })

    const members = [
        { id: project.owner.id, name: project.owner.name },
        ...project.members.map((m: { user: { id: string; name: string | null } }) => ({ id: m.user.id, name: m.user.name }))
    ]

    return NextResponse.json(members)
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { id } = await params
    const { email } = await req.json()

    const project = await prisma.project.findUnique({
        where: { id },
        include: { members: true }
    })
    if (!project) return NextResponse.json({ message: "Project tidak ditemukan" }, { status: 404 })

    const isMember = project.members.some(m => m.userId === session.user.id)
    const isOwner = project.ownerId === session.user.id
    if (!isMember && !isOwner) {
        return NextResponse.json({ message: "Kamu bukan anggota project ini" }, { status: 403 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 })

    if (user.id === project.ownerId || project.members.some(m => m.userId === user.id)) {
        return NextResponse.json({ message: "User sudah menjadi anggota" }, { status: 400 })
    }

    await prisma.member.create({ data: { userId: user.id, projectId: id } })

    // Cek apakah sudah ada invite pending
    const existingInvite = await prisma.invite.findFirst({
        where: { projectId: id, userId: user.id, status: "PENDING" }
    })
    if (existingInvite) {
        return NextResponse.json({ message: "Undangan sudah dikirim" }, { status: 400 })
    }

    // Buat invite
    const invite = await prisma.invite.create({
        data: { projectId: id, userId: user.id }
    })

    try {
        await createNotification({
            userId: user.id,
            type: "INVITE_PENDING",
            message: `Kamu diundang ke project "${project.name}"`,
            link: `/projects/${id}`,
            referenceId: invite.id
        })
    } catch (e) {
        console.error("Notification error:", e)
    }

    return NextResponse.json({ message: "Undangan berhasil dikirim", user: { id: user.id, name: user.name } })
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { id } = await params
    const { userId } = await req.json()

    const project = await prisma.project.findUnique({
        where: { id },
        include: { members: true }
    })
    if (!project) return NextResponse.json({ message: "Project tidak ditemukan" }, { status: 404 })

    if (project.ownerId !== session.user.id && userId !== session.user.id) {
        return NextResponse.json({ message: "Tidak diizinkan" }, { status: 403 })
    }

    await prisma.member.deleteMany({ where: { projectId: id, userId } })

    const isKicked = userId !== session.user.id
    const leavingUser = await prisma.user.findUnique({ where: { id: userId } })

    try {
        if (isKicked && leavingUser) {
            await createNotification({
                userId,
                type: "KICKED",
                message: `Kamu dikeluarkan dari project "${project.name}"`
            })
        }

        const otherIds = project.members
            .map(m => m.userId)
            .filter(uid => uid !== userId && uid !== session.user.id)

        if (otherIds.length > 0 && leavingUser) {
            await createNotificationMany(
                otherIds.map(uid => ({
                    userId: uid,
                    type: isKicked ? "MEMBER_KICKED" : "MEMBER_LEFT",
                    message: isKicked
                        ? `${leavingUser.name} dikeluarkan dari project "${project.name}"`
                        : `${leavingUser.name} keluar dari project "${project.name}"`,
                    link: `/projects/${id}`
                }))
            )
        }
    } catch (e) {
        console.error("Notification error:", e)
    }

    return NextResponse.json({ message: "Berhasil" })
}