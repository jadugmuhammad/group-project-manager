import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { prisma } from "@/lib/prisma"

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { id } = await params

    const project = await prisma.project.findUnique({ where: { id } })

    if (!project) return NextResponse.json({ message: "Project tidak ditemukan" }, { status: 404 })

    if (project.ownerId !== session.user.id) {
        return NextResponse.json({ message: "Hanya owner yang bisa menghapus project" }, { status: 403 })
    }

    await prisma.task.deleteMany({ where: { projectId: id } })
    await prisma.member.deleteMany({ where: { projectId: id } })
    await prisma.project.delete({ where: { id } })

    return NextResponse.json({ message: "Project dihapus" })
}