"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import AuthLayout from "@/app/components/AuthLayout"

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
        <AuthLayout
            tagline="Satu platform untuk semua proyek tim Anda."
            description="Buat akun gratis dan undang anggota tim Anda untuk mulai berkolaborasi hari ini."
        >
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
        </AuthLayout>
    )
}