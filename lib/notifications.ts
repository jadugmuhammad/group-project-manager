import { prisma } from "@/lib/prisma"

export async function createNotification({
    userId,
    type,
    message,
    link,
    referenceId
}: {
    userId: string
    type: string
    message: string
    link?: string
    referenceId?: string
}) {
    return prisma.notification.create({
        data: { userId, type, message, link, referenceId }
    })
}

export async function createNotificationMany(
    notifications: { userId: string; type: string; message: string; link?: string; referenceId?: string }[]
) {
    return prisma.notification.createMany({ data: notifications })
}