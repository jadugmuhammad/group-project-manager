"use client"

import { signOut } from "next-auth/react"

export default function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/login" })}
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
    )
}