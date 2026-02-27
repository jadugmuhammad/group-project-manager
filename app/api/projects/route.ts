import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const projects = await prisma.project.findMany({
        where: {
            OR: [
                { ownerId: session.user.id },
                { members: { some: { userId: session.user.id } } }
            ]
        },
        include: {
            owner: true,
            members: { include: { user: true } },
            tasks: true
        },
        orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(projects)
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { name, description, deadline } = await req.json()

    if (!name) return NextResponse.json({ message: "Nama project wajib diisi" }, { status: 400 })

    const project = await prisma.project.create({
        data: {
            name,
            description,
            deadline: deadline ? new Date(deadline) : null,
            ownerId: session.user.id
        }
    })

    await prisma.member.create({
        data: { userId: session.user.id, projectId: project.id }
    })

    return NextResponse.json(project)
}