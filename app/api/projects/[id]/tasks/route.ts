import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const { id } = await params
    const { title, description, deadline, assigneeId } = await req.json()

    if (!title) return NextResponse.json({ message: "Judul task harus diisi" }, { status: 400 })

    const task = await prisma.task.create({
        data: {
            title,
            description,
            deadline: deadline ? new Date(deadline) : null,
            assigneeId: assigneeId || null,
            projectId: id
        }
    })

    return NextResponse.json(task, { status: 201 })
}