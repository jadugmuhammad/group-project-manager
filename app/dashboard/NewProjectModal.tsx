"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import DatePicker from "@/app/components/DatePicker"

export default function NewProjectModal({ onClose }: { onClose: () => void }) {
    const router = useRouter()
    const [form, setForm] = useState({ name: "", description: "", deadline: "" })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        const res = await fetch("/api/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        })

        const data = await res.json()

        if (!res.ok) {
            setError(data.message)
            setLoading(false)
            return
        }

        router.push(`/projects/${data.id}`)
    }

    return (
        <>
            <style>{`
        .modal-box {
          background: #ffffff;
          width: 100%;
          max-width: 520px;
          border-top: 3px solid #0f62fe;
          max-height: 90vh;
          overflow-y: auto;
        }
        @media (max-width: 768px) {
          .modal-box {
            max-width: 100%;
            max-height: 100vh;
            height: 100%;
            border-top: none;
            border-left: 3px solid #0f62fe;
          }
          .modal-overlay {
            align-items: flex-end !important;
          }
        }
      `}</style>

            <div className="modal-overlay" style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                fontFamily: "'IBM Plex Sans', sans-serif"
            }}>
                <div className="modal-box">

                    <div style={{ padding: "24px 32px", borderBottom: "1px solid #e0e0e0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <p style={{ color: "#6f6f6f", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4, fontFamily: "'IBM Plex Mono', monospace" }}>
                                Project Baru
                            </p>
                            <h2 style={{ color: "#161616", fontSize: 20, fontWeight: 400 }}>Buat project baru</h2>
                        </div>
                        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#8d8d8d", fontSize: 24, lineHeight: 1, padding: 0 }}>
                            ×
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: 20 }}>

                            <div>
                                <label style={{ display: "block", color: "#525252", fontSize: 12, fontWeight: 500, marginBottom: 8 }}>
                                    Nama Project <span style={{ color: "#da1e28" }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Masukkan nama project"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    required
                                    style={{
                                        width: "100%",
                                        background: "#f4f4f4",
                                        border: "none",
                                        borderBottom: "2px solid #8d8d8d",
                                        padding: "12px 16px",
                                        fontSize: 14,
                                        fontFamily: "'IBM Plex Sans', sans-serif",
                                        color: "#161616",
                                        outline: "none",
                                        boxSizing: "border-box"
                                    }}
                                    onFocus={e => e.target.style.borderBottomColor = "#0f62fe"}
                                    onBlur={e => e.target.style.borderBottomColor = "#8d8d8d"}
                                />
                            </div>

                            <div>
                                <label style={{ display: "block", color: "#525252", fontSize: 12, fontWeight: 500, marginBottom: 8 }}>
                                    Deskripsi
                                </label>
                                <textarea
                                    placeholder="Jelaskan tujuan dan ruang lingkup project ini"
                                    rows={3}
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    style={{
                                        width: "100%",
                                        background: "#f4f4f4",
                                        border: "none",
                                        borderBottom: "2px solid #8d8d8d",
                                        padding: "12px 16px",
                                        fontSize: 14,
                                        fontFamily: "'IBM Plex Sans', sans-serif",
                                        color: "#161616",
                                        outline: "none",
                                        resize: "none",
                                        boxSizing: "border-box"
                                    }}
                                    onFocus={e => e.target.style.borderBottomColor = "#0f62fe"}
                                    onBlur={e => e.target.style.borderBottomColor = "#8d8d8d"}
                                />
                            </div>

                            <div>
                                <label style={{ display: "block", color: "#525252", fontSize: 12, fontWeight: 500, marginBottom: 8 }}>
                                    Deadline
                                </label>
                                <DatePicker
                                    value={form.deadline}
                                    onChange={date => setForm({ ...form, deadline: date })}
                                    placeholder="Pilih deadline"
                                />
                            </div>

                            {error && (
                                <div style={{ padding: "12px 16px", background: "#fff1f1", borderLeft: "3px solid #da1e28" }}>
                                    <p style={{ color: "#da1e28", fontSize: 13, margin: 0 }}>{error}</p>
                                </div>
                            )}

                        </div>

                        <div style={{ padding: "16px 32px", borderTop: "1px solid #e0e0e0", display: "flex", justifyContent: "flex-end", gap: 2 }}>
                            <button
                                type="button"
                                onClick={onClose}
                                style={{
                                    background: "transparent",
                                    border: "1px solid #8d8d8d",
                                    color: "#525252",
                                    padding: "10px 24px",
                                    fontSize: 14,
                                    fontFamily: "'IBM Plex Sans', sans-serif",
                                    cursor: "pointer"
                                }}
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    background: loading ? "#8d8d8d" : "#0f62fe",
                                    border: "none",
                                    color: "#ffffff",
                                    padding: "10px 24px",
                                    fontSize: 14,
                                    fontFamily: "'IBM Plex Sans', sans-serif",
                                    cursor: loading ? "not-allowed" : "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8
                                }}
                            >
                                <span>{loading ? "Membuat..." : "Buat Project"}</span>
                                {!loading && (
                                    <svg width="14" height="14" viewBox="0 0 16 16" fill="white">
                                        <path d="M8.707 1.5l-1.414 1.414L10.586 6H1v2h9.586l-3.293 3.086 1.414 1.414L14.414 7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}