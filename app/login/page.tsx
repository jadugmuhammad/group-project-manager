"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import AuthLayout from "@/app/components/AuthLayout"

export default function LoginPage() {
    const router = useRouter()
    const [form, setForm] = useState({ email: "", password: "" })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        const res = await signIn("credentials", {
            email: form.email,
            password: form.password,
            redirect: false
        })

        if (res?.error) {
            setError("Email atau password tidak valid.")
            setLoading(false)
            return
        }

        router.push("/dashboard")
    }

    return (
        <AuthLayout
            tagline="Kelola proyek kelompok dengan lebih terstruktur."
            description="Dirancang untuk mahasiswa yang membutuhkan visibilitas penuh atas progres tim dan pembagian tugas yang jelas."
        >
            <div style={{ marginBottom: 40 }}>
                <p style={{ color: "#6f6f6f", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8, fontFamily: "'IBM Plex Mono', monospace" }}>
                    Autentikasi
                </p>
                <h1 style={{ color: "#161616", fontSize: 28, fontWeight: 300, letterSpacing: "-0.01em" }}>
                    Masuk ke akun Anda
                </h1>
            </div>

            <form onSubmit={handleSubmit}>
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
                    <span>{loading ? "Memproses..." : "Masuk"}</span>
                    {!loading && (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                            <path d="M8.707 1.5l-1.414 1.414L10.586 6H1v2h9.586l-3.293 3.086 1.414 1.414L14.414 7z" />
                        </svg>
                    )}
                </button>
            </form>

            <div style={{ borderTop: "1px solid #e0e0e0", marginTop: 32, paddingTop: 24 }}>
                <p style={{ color: "#525252", fontSize: 14 }}>
                    Belum memiliki akun?{" "}
                    <Link href="/register" style={{ color: "#0f62fe", textDecoration: "none", fontWeight: 500 }}>
                        Daftar sekarang
                    </Link>
                </p>
            </div>
        </AuthLayout>
    )
}