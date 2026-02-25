"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegisterPage() {
    const router = useRouter()
    const [form, setForm] = useState({ name: "", email: "", password: "" })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        const res = await fetch("/api/register", {
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

        router.push("/login")
    }

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
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
        .ibm-btn {
          width: 100%;
          background: #0f62fe;
          color: #ffffff;
          border: none;
          padding: 14px 16px;
          font-size: 14px;
          font-family: 'IBM Plex Sans', sans-serif;
          cursor: pointer;
          text-align: left;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background 0.1s;
        }
        .ibm-btn:hover { background: #0353e9; }
        .ibm-btn:disabled { background: #8d8d8d; cursor: not-allowed; }
        .field-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: #525252;
          margin-bottom: 8px;
          letter-spacing: 0.01em;
        }
      `}</style>

            <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'IBM Plex Sans', sans-serif", background: "#f4f4f4" }}>

                {/* Panel Kiri */}
                <div style={{ width: "50%", background: "#161616", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "48px", minHeight: "100vh" }} className="hidden lg:flex">
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <svg width="24" height="24" viewBox="0 0 32 32" fill="white">
                            <rect x="0" y="0" width="6" height="32" />
                            <rect x="8" y="6" width="6" height="20" />
                            <rect x="16" y="0" width="6" height="32" />
                            <rect x="24" y="6" width="8" height="4" />
                            <rect x="24" y="14" width="8" height="4" />
                            <rect x="24" y="22" width="8" height="4" />
                        </svg>
                        <span style={{ color: "#ffffff", fontSize: 16, fontWeight: 400 }}>Projectum</span>
                    </div>

                    <div>
                        <p style={{ color: "#6f6f6f", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16, fontFamily: "'IBM Plex Mono', monospace" }}>
                            Mulai Sekarang
                        </p>
                        <h2 style={{ color: "#ffffff", fontSize: 42, fontWeight: 300, lineHeight: 1.25, marginBottom: 24, letterSpacing: "-0.01em" }}>
                            Satu platform<br />untuk semua<br />proyek tim Anda.
                        </h2>
                        <p style={{ color: "#8d8d8d", fontSize: 14, lineHeight: 1.7, maxWidth: 360 }}>
                            Buat akun gratis dan undang anggota tim Anda untuk mulai berkolaborasi hari ini.
                        </p>
                    </div>

                    <div style={{ borderTop: "1px solid #393939", paddingTop: 24 }}>
                        <a href="https://github.com/jadugmuhammad" target="_blank" style={{ color: "#6f6f6f", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", textDecoration: "none" }}>Made by github.com/jadugmuhammad</a>
                    </div>
                </div>

                {/* Panel Kanan */}
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 32px", background: "#f4f4f4" }}>
                    <div style={{ width: "100%", maxWidth: 400 }}>

                        <div style={{ marginBottom: 40 }}>
                            <p style={{ color: "#6f6f6f", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8, fontFamily: "'IBM Plex Mono', monospace" }}>
                                Registrasi
                            </p>
                            <h1 style={{ color: "#161616", fontSize: 28, fontWeight: 300, letterSpacing: "-0.01em" }}>
                                Buat akun baru
                            </h1>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: 16 }}>
                                <label className="field-label">Nama Lengkap</label>
                                <input
                                    type="text"
                                    className="ibm-input"
                                    placeholder="Nama Anda"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: 16 }}>
                                <label className="field-label">Alamat Email</label>
                                <input
                                    type="email"
                                    className="ibm-input"
                                    placeholder="nama@email.com"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: 32 }}>
                                <label className="field-label">Password</label>
                                <input
                                    type="password"
                                    className="ibm-input"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    required
                                />
                            </div>

                            {error && (
                                <div style={{ marginBottom: 20, padding: "12px 16px", background: "#fff1f1", borderLeft: "3px solid #da1e28" }}>
                                    <p style={{ color: "#da1e28", fontSize: 13 }}>{error}</p>
                                </div>
                            )}

                            <button type="submit" disabled={loading} className="ibm-btn">
                                <span>{loading ? "Memproses..." : "Buat Akun"}</span>
                                {!loading && (
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                                        <path d="M8.707 1.5l-1.414 1.414L10.586 6H1v2h9.586l-3.293 3.086 1.414 1.414L14.414 7z" />
                                    </svg>
                                )}
                            </button>
                        </form>

                        <div style={{ borderTop: "1px solid #e0e0e0", marginTop: 32, paddingTop: 24 }}>
                            <p style={{ color: "#525252", fontSize: 14 }}>
                                Sudah memiliki akun?{" "}
                                <Link href="/login" style={{ color: "#0f62fe", textDecoration: "none", fontWeight: 500 }}>
                                    Masuk sekarang
                                </Link>
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}