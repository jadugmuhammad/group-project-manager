"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function NewProjectPage() {
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
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono&display=swap');
        * { box-sizing: border-box; }
        body { background: #f4f4f4; margin: 0; }
        .ibm-input {
          width: 100%;
          background: #ffffff;
          border: none;
          border-bottom: 1px solid #8d8d8d;
          padding: 13px 16px;
          font-size: 14px;
          font-family: 'IBM Plex Sans', sans-serif;
          color: #161616;
          outline: none;
          transition: border-bottom 0.1s;
        }
        .ibm-input:focus {
          border-bottom: 2px solid #0f62fe;
          outline: 2px solid #0f62fe;
          outline-offset: -2px;
        }
        .ibm-input::placeholder { color: #a8a8a8; }
        .ibm-textarea {
          width: 100%;
          background: #ffffff;
          border: none;
          border-bottom: 1px solid #8d8d8d;
          padding: 13px 16px;
          font-size: 14px;
          font-family: 'IBM Plex Sans', sans-serif;
          color: #161616;
          outline: none;
          resize: vertical;
          transition: border-bottom 0.1s;
        }
        .ibm-textarea:focus {
          border-bottom: 2px solid #0f62fe;
          outline: 2px solid #0f62fe;
          outline-offset: -2px;
        }
        .field-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: #525252;
          margin-bottom: 8px;
          letter-spacing: 0.01em;
          font-family: 'IBM Plex Sans', sans-serif;
        }
      `}</style>

            <div style={{ minHeight: "100vh", background: "#f4f4f4", fontFamily: "'IBM Plex Sans', sans-serif" }}>

                {/* Navbar */}
                <nav style={{ background: "#161616", padding: "0 48px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 48, borderBottom: "1px solid #393939" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <svg width="20" height="20" viewBox="0 0 32 32" fill="white">
                            <rect x="0" y="0" width="6" height="32" />
                            <rect x="8" y="6" width="6" height="20" />
                            <rect x="16" y="0" width="6" height="32" />
                            <rect x="24" y="6" width="8" height="4" />
                            <rect x="24" y="14" width="8" height="4" />
                            <rect x="24" y="22" width="8" height="4" />
                        </svg>
                        <span style={{ color: "#ffffff", fontSize: 14 }}>Projectum</span>
                    </div>
                    <Link href="/dashboard" style={{ color: "#8d8d8d", fontSize: 13, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="#8d8d8d">
                            <path d="M7.293 1.5L1.5 7.293l5.793 5.793 1.414-1.414L4.414 8H15V6H4.414l4.293-4.293z" />
                        </svg>
                        Dashboard
                    </Link>
                </nav>

                {/* Header */}
                <div style={{ background: "#ffffff", borderBottom: "1px solid #e0e0e0", padding: "40px 48px" }}>
                    <p style={{ color: "#6f6f6f", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8, fontFamily: "'IBM Plex Mono', monospace" }}>
                        Project Baru
                    </p>
                    <h1 style={{ color: "#161616", fontSize: 36, fontWeight: 300, letterSpacing: "-0.01em" }}>
                        Buat project baru
                    </h1>
                </div>

                <div style={{ padding: "40px 48px" }}>
                    <div style={{ maxWidth: 640, background: "#ffffff", borderTop: "3px solid #0f62fe", padding: "40px" }}>

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: 24 }}>
                                <label className="field-label">Nama Project <span style={{ color: "#da1e28" }}>*</span></label>
                                <input
                                    type="text"
                                    className="ibm-input"
                                    placeholder="Masukkan nama project"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: 24 }}>
                                <label className="field-label">Deskripsi</label>
                                <textarea
                                    className="ibm-textarea"
                                    placeholder="Jelaskan tujuan dan ruang lingkup project ini"
                                    rows={4}
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                />
                            </div>

                            <div style={{ marginBottom: 40 }}>
                                <label className="field-label">Deadline</label>
                                <input
                                    type="date"
                                    className="ibm-input"
                                    value={form.deadline}
                                    onChange={e => setForm({ ...form, deadline: e.target.value })}
                                />
                            </div>

                            {error && (
                                <div style={{ marginBottom: 24, padding: "12px 16px", background: "#fff1f1", borderLeft: "3px solid #da1e28" }}>
                                    <p style={{ color: "#da1e28", fontSize: 13, margin: 0 }}>{error}</p>
                                </div>
                            )}

                            <div style={{ display: "flex", gap: 2 }}>
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    style={{
                                        background: "transparent",
                                        border: "1px solid #8d8d8d",
                                        color: "#525252",
                                        padding: "13px 24px",
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
                                        color: "#ffffff",
                                        border: "none",
                                        padding: "13px 32px",
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
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                                            <path d="M8.707 1.5l-1.414 1.414L10.586 6H1v2h9.586l-3.293 3.086 1.414 1.414L14.414 7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </>
    )
}