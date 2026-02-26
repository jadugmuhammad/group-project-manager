import Link from "next/link"
import { ReactNode } from "react"
import UserMenu from "./UserMenu"

type Props = {
    backHref?: string
    backLabel?: string
    right?: ReactNode
    user?: { name?: string | null; email?: string | null }
    path?: { label: string; href?: string }[]
}

export default function Navbar({ backHref, backLabel, right, user, path }: Props) {
    return (
        <nav style={{ background: "#161616", borderBottom: "1px solid #393939", height: 48 }}>
            <div className="nav-inner" style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Link href="/" style={{ color: "#ffffff", fontSize: 14, fontWeight: 400, letterSpacing: "0.01em", textDecoration: "none", whiteSpace: "nowrap" }}>
                        Group Project Manager
                    </Link>

                    {path && path.map((item, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center" }}>
                            <span style={{ color: "#525252", fontSize: 13, margin: "0 12px" }}>/</span>
                            {item.href ? (
                                <Link href={item.href} style={{ color: "#8d8d8d", fontSize: 13, textDecoration: "none" }}>
                                    {item.label}
                                </Link>
                            ) : (
                                <span style={{ color: "#c6c6c6", fontSize: 13 }}>{item.label}</span>
                            )}
                        </div>
                    ))}

                    {!path && backHref && (
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <span style={{ color: "#525252", fontSize: 13, margin: "0 12px" }}>/</span>
                            <Link href={backHref} style={{ color: "#8d8d8d", fontSize: 13, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
                                <svg width="12" height="12" viewBox="0 0 16 16" fill="#8d8d8d">
                                    <path d="M7.293 1.5L1.5 7.293l5.793 5.793 1.414-1.414L4.414 8H15V6H4.414l4.293-4.293z" />
                                </svg>
                                {backLabel || "Kembali"}
                            </Link>
                        </div>
                    )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    {user && <UserMenu name={user.name} email={user.email} />}
                    {right && right}
                </div>
            </div>
        </nav>
    )
}