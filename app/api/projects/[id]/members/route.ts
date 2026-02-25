import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { id } = await params
    const { email } = await req.json()

    const project = await prisma.project.findUnique({ where: { id } })
    if (!project) return NextResponse.json({ message: "Project tidak ditemukan" }, { status: 404 })

    if (project.ownerId !== session.user.id) {
        return NextResponse.json({ message: "Hanya owner yang bisa mengundang anggota" }, { status: 403 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return NextResponse.json({ message: "User dengan email tersebut tidak ditemukan" }, { status: 404 })

    if (user.id === session.user.id) {
        return NextResponse.json({ message: "Kamu sudah menjadi owner project ini" }, { status: 400 })
    }

    const existing = await prisma.member.findUnique({
        where: { userId_projectId: { userId: user.id, projectId: id } }
    })
    if (existing) return NextResponse.json({ message: "User sudah menjadi anggota" }, { status: 400 })

    await prisma.member.create({
        data: { userId: user.id, projectId: id }
    })

    return NextResponse.json({ message: "Anggota berhasil ditambahkan" })
}