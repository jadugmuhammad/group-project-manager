import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { prisma } from "@/lib/prisma"
import { createNotification, createNotificationMany } from "@/lib/notifications"

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { id } = await params
    const { action } = await req.json() // "accept" | "decline"

    const invite = await prisma.invite.findUnique({
        where: { id },
        include: { project: { include: { members: true } } }
    })

    if (!invite) return NextResponse.json({ message: "Undangan tidak ditemukan" }, { status: 404 })
    if (invite.userId !== session.user.id) return NextResponse.json({ message: "Tidak diizinkan" }, { status: 403 })
    if (invite.status !== "PENDING") return NextResponse.json({ message: "Undangan sudah diproses" }, { status: 400 })

    if (action === "accept") {
        // Tambah sebagai member
        await prisma.member.create({
            data: { userId: session.user.id, projectId: invite.projectId }
        })

        await prisma.invite.update({ where: { id }, data: { status: "ACCEPTED" } })

        try {
            // Notifikasi ke owner
            await createNotification({
                userId: invite.project.ownerId,
                type: "MEMBER_JOINED",
                message: `${session.user.name} menerima undangan dan bergabung ke project "${invite.project.name}"`,
                link: `/projects/${invite.projectId}`
            })

            // Notifikasi ke anggota lain
            const otherIds = invite.project.members
                .map(m => m.userId)
                .filter(uid => uid !== session.user.id && uid !== invite.project.ownerId)

            if (otherIds.length > 0) {
                await createNotificationMany(
                    otherIds.map(uid => ({
                        userId: uid,
                        type: "MEMBER_JOINED",
                        message: `${session.user.name} bergabung ke project "${invite.project.name}"`,
                        link: `/projects/${invite.projectId}`
                    }))
                )
            }
        } catch (e) {
            console.error("Notification error:", e)
        }

        return NextResponse.json({ message: "Undangan diterima" })

    } else if (action === "decline") {
        await prisma.invite.update({ where: { id }, data: { status: "DECLINED" } })

        try {
            await createNotification({
                userId: invite.project.ownerId,
                type: "INVITE_DECLINED",
                message: `${session.user.name} menolak undangan ke project "${invite.project.name}"`
            })
        } catch (e) {
            console.error("Notification error:", e)
        }

        return NextResponse.json({ message: "Undangan ditolak" })
    }

    return NextResponse.json({ message: "Action tidak valid" }, { status: 400 })
}