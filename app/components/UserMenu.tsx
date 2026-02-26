"use client"

import { useState, useRef, useEffect } from "react"
import { signOut } from "next-auth/react"
import ConfirmModal from "./ConfirmModal"

type Props = {
    name?: string | null
    email?: string | null
}

export default function UserMenu({ name, email }: Props) {
    const [showLogout, setShowLogout] = useState(false)
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener("mousedown", handleClick)
        return () => document.removeEventListener("mousedown", handleClick)
    }, [])

    return (
        <>
            {showLogout && (
                <ConfirmModal
                    message="Apakah kamu yakin ingin keluar?"
                    onConfirm={() => signOut({ callbackUrl: "/login" })}
                    onCancel={() => setShowLogout(false)}
                    confirmLabel="Keluar"
                    confirmColor="#393939"
                />
            )}

            <div ref={ref} style={{ position: "relative" }}>
                <div
                    onClick={() => setOpen(prev => !prev)}
                    style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: open ? "#0353e9" : "#0f62fe",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        flexShrink: 0,
                        border: open ? "2px solid #ffffff" : "2px solid transparent",
                        transition: "all 0.1s"
                    }}
                >
                    <span style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>
                        {name?.charAt(0).toUpperCase()}
                    </span>
                </div>

                {open && (
                    <div style={{
                        position: "absolute",
                        top: "calc(100% + 8px)",
                        right: 0,
                        background: "#ffffff",
                        border: "1px solid #e0e0e0",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                        zIndex: 100,
                        minWidth: 200
                    }}>
                        <div style={{ padding: "16px", borderBottom: "1px solid #e0e0e0" }}>
                            <p style={{ color: "#161616", fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{name}</p>
                            <p style={{ color: "#8d8d8d", fontSize: 11, fontFamily: "'IBM Plex Mono', monospace" }}>{email}</p>
                        </div>
                        <button
                            onClick={() => { setOpen(false); setShowLogout(true) }}
                            style={{
                                display: "block",
                                width: "100%",
                                background: "none",
                                border: "none",
                                padding: "12px 16px",
                                fontSize: 13,
                                fontFamily: "'IBM Plex Sans', sans-serif",
                                color: "#da1e28",
                                cursor: "pointer",
                                textAlign: "left"
                            }}
                            onMouseOver={e => (e.currentTarget.style.background = "#fff1f1")}
                            onMouseOut={e => (e.currentTarget.style.background = "none")}
                        >
                            Keluar
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}