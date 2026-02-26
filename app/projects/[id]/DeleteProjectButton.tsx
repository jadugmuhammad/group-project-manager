"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import ConfirmModal from "../../components/ConfirmModal"

export default function DeleteProjectButton({ projectId, isOwner }: { projectId: string; isOwner: boolean }) {
    const router = useRouter()
    const [deleting, setDeleting] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    if (!isOwner) return null

    const handleDelete = async () => {
        setDeleting(true)
        setShowConfirm(false)
        await fetch(`/api/projects/${projectId}`, { method: "DELETE" })
        router.push("/dashboard")
    }

    return (
        <>
            {showConfirm && (
                <ConfirmModal
                    message="Hapus project ini? Semua task akan ikut terhapus dan tindakan ini tidak dapat dibatalkan."
                    onConfirm={handleDelete}
                    onCancel={() => setShowConfirm(false)}
                />
            )}

            <button
                onClick={() => setShowConfirm(true)}
                disabled={deleting}
                style={{
                    background: "transparent",
                    border: "1px solid #da1e28",
                    color: "#da1e28",
                    padding: "6px 16px",
                    fontSize: 12,
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    cursor: deleting ? "not-allowed" : "pointer",
                    opacity: deleting ? 0.5 : 1
                }}
            >
                {deleting ? "Menghapus..." : "Hapus Project"}
            </button>
        </>
    )
}