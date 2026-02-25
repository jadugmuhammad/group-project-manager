import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { name, description, deadline } = await req.json()

    if (!name) {
        return NextResponse.json({ message: "Nama project harus diisi" }, { status: 400 })
    }

    const project = await prisma.project.create({
        data: {
            name,
            description,
            deadline: deadline ? new Date(deadline) : null,
            ownerId: session.user.id
        }
    })

    return NextResponse.json(project, { status: 201 })
}