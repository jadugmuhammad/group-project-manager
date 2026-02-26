"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"

type Member = {
    id: string
    name: string | null
}

export default function NewTaskPage() {
    const router = useRouter()
    const params = useParams()
    const projectId = params.id as string

    const [form, setForm] = useState({ title: "", description: "", deadline: "", assigneeId: "" })
    const [members, setMembers] = useState<Member[]>([])
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetch(`/api/projects/${projectId}/members`)
            .then(res => res.json())
            .then(data => setMembers(data))
    }, [projectId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        const res = await fetch(`/api/projects/${projectId}/tasks`, {
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

        router.push(`/projects/${projectId}`)
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
          border-bottom: 2px solid #8d8d8d;
          padding: 13px 16px;
          font-size: 14px;
          font-family: 'IBM Plex Sans', sans-serif;
          color: #161616;
          outline: none;
        }
        .ibm-input:focus {
          border-bottom: 2px solid #0f62fe;
          outline: none;
        }
        .ibm-input::placeholder { color: #a8a8a8; }
        .ibm-textarea {
          width: 100%;
          background: #ffffff;
          border: none;
          border-bottom: 2px solid #8d8d8d;
          padding: 13px 16px;
          font-size: 14px;
          font-family: 'IBM Plex Sans', sans-serif;
          color: #161616;
          outline: none;
          resize: none;
        }
        .ibm-textarea:focus {
          border-bottom: 2px solid #0f62fe;
          outline: none;
        }
        .ibm-select {
          width: 100%;
          background: #ffffff;
          border: none;
          border-bottom: 2px solid #8d8d8d;
          padding: 13px 16px;
          font-size: 14px;
          font-family: 'IBM Plex Sans', sans-serif;
          color: #161616;
          outline: none;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23525252' d='M8 11L3 6h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 16px center;
        }
        .ibm-select:focus {
          border-bottom: 2px solid #0f62fe;
          outline: none;
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
                    <Link href={`/projects/${projectId}`} style={{ color: "#8d8d8d", fontSize: 13, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="#8d8d8d">
                            <path d="M7.293 1.5L1.5 7.293l5.793 5.793 1.414-1.414L4.414 8H15V6H4.414l4.293-4.293z" />
                        </svg>
                        Kembali ke Project
                    </Link>
                </nav>

                {/* Header */}
                <div style={{ background: "#ffffff", borderBottom: "1px solid #e0e0e0", padding: "40px 48px" }}>
                    <p style={{ color: "#6f6f6f", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8, fontFamily: "'IBM Plex Mono', monospace" }}>
                        Task Baru
                    </p>
                    <h1 style={{ color: "#161616", fontSize: 36, fontWeight: 300, letterSpacing: "-0.01em" }}>
                        Tambah task
                    </h1>
                </div>

                <div style={{ padding: "40px 48px" }}>
                    <div style={{ maxWidth: 640, background: "#ffffff", borderTop: "3px solid #0f62fe", padding: "40px" }}>

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: 24 }}>
                                <label className="field-label">Judul Task <span style={{ color: "#da1e28" }}>*</span></label>
                                <input
                                    type="text"
                                    className="ibm-input"
                                    placeholder="Masukkan judul task"
                                    value={form.title}
                                    onChange={e => setForm({ ...form, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: 24 }}>
                                <label className="field-label">Deskripsi</label>
                                <textarea
                                    className="ibm-textarea"
                                    placeholder="Jelaskan detail task ini"
                                    rows={3}
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                />
                            </div>

                            <div style={{ marginBottom: 24 }}>
                                <label className="field-label">Deadline</label>
                                <input
                                    type="date"
                                    className="ibm-input"
                                    value={form.deadline}
                                    onChange={e => setForm({ ...form, deadline: e.target.value })}
                                />
                            </div>

                            <div style={{ marginBottom: 40 }}>
                                <label className="field-label">Assign ke</label>
                                <select
                                    className="ibm-select"
                                    value={form.assigneeId}
                                    onChange={e => setForm({ ...form, assigneeId: e.target.value })}
                                >
                                    <option value="">— Pilih anggota —</option>
                                    {members.map(member => (
                                        <option key={member.id} value={member.id}>{member.name}</option>
                                    ))}
                                </select>
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
                                    <span>{loading ? "Menyimpan..." : "Simpan Task"}</span>
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