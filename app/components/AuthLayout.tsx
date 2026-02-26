import { ReactNode } from "react"

type Props = {
    children: ReactNode
    tagline: string
    description: string
}

export default function AuthLayout({ children, tagline, description }: Props) {
    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f4f4f4; }
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
        .ibm-input:focus { border-bottom-color: #0f62fe; }
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
        .auth-container {
          min-height: 100vh;
          display: flex;
          font-family: 'IBM Plex Sans', sans-serif;
          background: #f4f4f4;
        }
        .auth-left {
          width: 50%;
          background: #161616;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px;
          min-height: 100vh;
        }
        .auth-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 32px;
          background: #f4f4f4;
        }
        .auth-form { width: 100%; max-width: 400px; }
        .mobile-brand { display: none; }
        @media (max-width: 768px) {
          .auth-left { display: none; }
          .auth-right { padding: 40px 24px; align-items: flex-start; padding-top: 48px; }
          .auth-form { max-width: 100%; }
          .mobile-brand { display: flex; align-items: center; gap: 8px; margin-bottom: 40px; }
        }
      `}</style>

            <div className="auth-container">
                {/* Panel Kiri */}
                <div className="auth-left">
                    <div>
                        <span style={{ color: "#ffffff", fontSize: 16, fontWeight: 400 }}>
                            Group Project Manager
                        </span>
                    </div>
                    <div>
                        <p style={{ color: "#6f6f6f", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16, fontFamily: "'IBM Plex Mono', monospace" }}>
                            Platform Kolaborasi
                        </p>
                        <h2 style={{ color: "#ffffff", fontSize: 42, fontWeight: 300, lineHeight: 1.25, marginBottom: 24, letterSpacing: "-0.01em" }}>
                            {tagline}
                        </h2>
                        <p style={{ color: "#8d8d8d", fontSize: 14, lineHeight: 1.7, maxWidth: 360 }}>
                            {description}
                        </p>
                    </div>
                    <div style={{ borderTop: "1px solid #393939", paddingTop: 24 }}>
                        <a href="https://github.com/jadugmuhammad" target="_blank" style={{ color: "#6f6f6f", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", textDecoration: "none" }}>
                            Made by github.com/jadugmuhammad
                        </a>
                    </div>
                </div>

                {/* Panel Kanan */}
                <div className="auth-right">
                    <div className="auth-form">
                        <div className="mobile-brand">
                            <span style={{ color: "#161616", fontSize: 14, fontWeight: 400 }}>Group Project Manager</span>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
}