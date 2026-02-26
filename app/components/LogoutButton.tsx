"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import ConfirmModal from "./ConfirmModal"

export default function LogoutButton() {
    const [showConfirm, setShowConfirm] = useState(false)

    return (
        <>
            {showConfirm && (
                <ConfirmModal
                    message="Apakah kamu yakin ingin keluar?"
                    onConfirm={() => signOut({ callbackUrl: "/login" })}
                    onCancel={() => setShowConfirm(false)}
                    confirmLabel="Keluar"
                    confirmColor="#393939"
                />
            )}
            <button
                onClick={() => setShowConfirm(true)}
                style={{
                    background: "transparent",
                    border: "1px solid #525252",
                    color: "#c6c6c6",
                    padding: "4px 16px",
                    fontSize: 12,
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    cursor: "pointer",
                    letterSpacing: "0.01em",
                    transition: "all 0.1s"
                }}
                onMouseOver={e => {
                    (e.target as HTMLButtonElement).style.background = "#393939"
                        ; (e.target as HTMLButtonElement).style.color = "#ffffff"
                }}
                onMouseOut={e => {
                    (e.target as HTMLButtonElement).style.background = "transparent"
                        ; (e.target as HTMLButtonElement).style.color = "#c6c6c6"
                }}
            >
                Keluar
            </button>
        </>
    )
}