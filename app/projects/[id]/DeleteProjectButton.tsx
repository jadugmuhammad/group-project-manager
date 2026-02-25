"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function DeleteProjectButton({ projectId, isOwner }: { projectId: string; isOwner: boolean }) {
    const router = useRouter()
    const [deleting, setDeleting] = useState(false)

    if (!isOwner) return null

    const handleDelete = async () => {
        if (!confirm("Hapus project ini? Semua task akan ikut terhapus.")) return
        setDeleting(true)
        await fetch(`/api/projects/${projectId}`, { method: "DELETE" })
        router.push("/dashboard")
    }

    return (
        <button
            onClick={handleDelete}
            disabled={deleting}
            style={{
                background: "transparent",
                border: "1px solid #da1e28",
                color: "#da1e28",
                padding: "6px 16px",
                fontSize: 12,
                fontFamily: "'IBM Plex Sans', sans-serif",
                cursor: deleting ? "not-allowed" : "pointer",
                opacity: deleting ? 0.5 : 1,
                letterSpacing: "0.01em"
            }}
        >
            {deleting ? "Menghapus..." : "Hapus Project"}
        </button>
    )
}