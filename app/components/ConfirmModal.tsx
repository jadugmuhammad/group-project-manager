"use client"

type Props = {
    message: string
    onConfirm: () => void
    onCancel: () => void
}

export default function ConfirmModal({ message, onConfirm, onCancel }: Props) {
    return (
        <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
        }}>
            <div style={{
                background: "#ffffff",
                width: "100%",
                maxWidth: 480,
                borderTop: "3px solid #da1e28",
                fontFamily: "'IBM Plex Sans', sans-serif"
            }}>
                <div style={{ padding: "42px 32px", borderBottom: "1px solid #e0e0e0" }}>
                    <p style={{ color: "#6f6f6f", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8, fontFamily: "'IBM Plex Mono', monospace", textAlign: "left" }}>
                        Konfirmasi
                    </p>
                    <p style={{ color: "#161616", fontSize: 16, fontWeight: 400, lineHeight: 1.5, textAlign: "left" }}>
                        {message}
                    </p>
                </div>
                <div style={{ padding: "14px 32px", display: "flex", justifyContent: "flex-end", gap: 2 }}>
                    <button
                        onClick={onCancel}
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
                        onClick={onConfirm}
                        style={{
                            background: "#da1e28",
                            border: "none",
                            color: "#ffffff",
                            padding: "10px 24px",
                            fontSize: 14,
                            fontFamily: "'IBM Plex Sans', sans-serif",
                            cursor: "pointer"
                        }}
                    >
                        Hapus
                    </button>
                </div>
            </div>
        </div>
    )
}