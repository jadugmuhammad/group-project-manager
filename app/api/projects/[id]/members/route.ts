import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { prisma } from "@/lib/prisma"

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

    return NextResponse.json({ message: "Anggota berhasil ditambahkan", user: { id: user.id, name: user.name } })
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { id } = await params
    const { userId } = await req.json()

    const project = await prisma.project.findUnique({ where: { id } })
    if (!project) return NextResponse.json({ message: "Project tidak ditemukan" }, { status: 404 })

    if (project.ownerId !== session.user.id && userId !== session.user.id) {
        return NextResponse.json({ message: "Tidak diizinkan" }, { status: 403 })
    }

    await prisma.member.deleteMany({ where: { projectId: id, userId } })

    return NextResponse.json({ message: "Berhasil" })
}