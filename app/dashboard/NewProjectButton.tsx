"use client"

import { useState } from "react"
import NewProjectModal from "./NewProjectModal"

export default function NewProjectButton() {
    const [showModal, setShowModal] = useState(false)

    return (
        <>
            {showModal && <NewProjectModal onClose={() => setShowModal(false)} />}
            <button
                onClick={() => setShowModal(true)}
                style={{
                    background: "#0f62fe",
                    color: "#ffffff",
                    border: "none",
                    padding: "12px 24px",
                    fontSize: 14,
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    whiteSpace: "nowrap",
                    flexShrink: 0
                }}
            >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="white">
                    <path d="M7 1v6H1v2h6v6h2V9h6V7H9V1z" />
                </svg>
                <span>Buat Project</span>
            </button>
        </>
    )
}