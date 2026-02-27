"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import ConfirmModal from "@/app/components/ConfirmModal"
import InviteMember from "./InviteMember"

type Member = {
    id: string
    name: string | null
}

type Props = {
    projectId: string
    ownerId: string
    currentUserId: string
    initialMembers: Member[]
}

function MemberDropdown({ member, onKick, onMakeOwner }: {
    member: Member
    onKick: () => void
    onMakeOwner: () => void
}) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener("mousedown", handleClick)
        return () => document.removeEventListener("mousedown", handleClick)
    }, [])

    return (
        <div ref={ref} style={{ position: "relative", marginLeft: 4 }}>
            <button
                onClick={() => setOpen(prev => !prev)}
                style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#8d8d8d",
                    fontSize: 12,
                    padding: "0 2px",
                    marginBottom: "6px",
                    lineHeight: 1,
                    letterSpacing: 1
                }}
            >
                ⋮
            </button>
            {open && (
                <div style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    background: "#ffffff",
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                    zIndex: 100,
                    minWidth: 160
                }}>
                    <button
                        onClick={() => { onMakeOwner(); setOpen(false) }}
                        style={{
                            display: "block",
                            width: "100%",
                            background: "none",
                            border: "none",
                            borderBottom: "1px solid #e0e0e0",
                            padding: "10px 16px",
                            fontSize: 13,
                            fontFamily: "'IBM Plex Sans', sans-serif",
                            color: "#161616",
                            cursor: "pointer",
                            textAlign: "left"
                        }}
                        onMouseOver={e => (e.currentTarget.style.background = "#f4f4f4")}
                        onMouseOut={e => (e.currentTarget.style.background = "none")}
                    >
                        Jadikan Owner
                    </button>
                    <button
                        onClick={() => { onKick(); setOpen(false) }}
                        style={{
                            display: "block",
                            width: "100%",
                            background: "none",
                            border: "none",
                            padding: "10px 16px",
                            fontSize: 13,
                            fontFamily: "'IBM Plex Sans', sans-serif",
                            color: "#da1e28",
                            cursor: "pointer",
                            textAlign: "left"
                        }}
                        onMouseOver={e => (e.currentTarget.style.background = "#fff1f1")}
                        onMouseOut={e => (e.currentTarget.style.background = "none")}
                    >
                        Keluarkan
                    </button>
                </div>
            )}
        </div>
    )
}

export default function MembersSection({ projectId, ownerId, currentUserId, initialMembers }: Props) {
    const router = useRouter()
    const [members, setMembers] = useState<Member[]>(initialMembers)
    const [currentOwnerId, setCurrentOwnerId] = useState(ownerId)
    const [kickTarget, setKickTarget] = useState<Member | null>(null)
    const [ownerTarget, setOwnerTarget] = useState<Member | null>(null)

    const isOwner = currentUserId === currentOwnerId

    const handleKick = async () => {
        if (!kickTarget) return
        await fetch(`/api/projects/${projectId}/members`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: kickTarget.id })
        })
        setMembers(prev => prev.filter(m => m.id !== kickTarget.id))
        setKickTarget(null)
    }

    const handleChangeOwner = async () => {
        if (!ownerTarget) return
        await fetch(`/api/projects/${projectId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ownerId: ownerTarget.id })
        })
        setCurrentOwnerId(ownerTarget.id)
        setOwnerTarget(null)
        window.location.reload()
    }

    const handleMemberAdded = (member: Member) => {
        setMembers(prev => [...prev, member])
    }

    return (
        <>
            {kickTarget && (
                <ConfirmModal
                    message={<>Keluarkan <strong>{kickTarget.name}</strong> dari project ini?</>}
                    onConfirm={handleKick}
                    onCancel={() => setKickTarget(null)}
                    confirmLabel="Keluarkan"
                />
            )}
            {ownerTarget && (
                <ConfirmModal
                    message={<>Jadikan <strong>{ownerTarget.name}</strong> sebagai owner baru? Kamu akan kehilangan akses owner.</>}
                    onConfirm={handleChangeOwner}
                    onCancel={() => setOwnerTarget(null)}
                    confirmLabel="Jadikan Owner"
                    confirmColor="#0f62fe"
                />
            )}

            <div style={{ background: "#ffffff", borderTop: "3px solid #0f62fe", padding: "24px", marginBottom: 2 }}>
                <div className="members-row">
                    <div style={{ flex: 1 }}>
                        <p style={{ color: "#6f6f6f", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16, fontFamily: "'IBM Plex Mono', monospace" }}>
                            Anggota Tim — {members.length} orang
                        </p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {members.map(member => {
                                const isMemberOwner = member.id === currentOwnerId
                                return (
                                    <div key={member.id} style={{ display: "flex", alignItems: "center", gap: 8, background: "#f4f4f4", padding: "8px 16px" }}>
                                        <div style={{ width: 24, height: 24, background: isMemberOwner ? "#0f62fe" : "#8d8d8d", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}>
                                            <span style={{ color: "#fff", fontSize: 11, fontWeight: 600 }}>
                                                {member.name?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <span style={{ color: "#161616", fontSize: 13 }}>{member.name}</span>
                                        {isMemberOwner && (
                                            <span style={{ color: "#0f62fe", fontSize: 10, fontFamily: "'IBM Plex Mono', monospace" }}>OWNER</span>
                                        )}
                                        {isOwner && !isMemberOwner && (
                                            <MemberDropdown
                                                member={member}
                                                onKick={() => setKickTarget(member)}
                                                onMakeOwner={() => setOwnerTarget(member)}
                                            />
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="invite-section">
                        <p style={{ color: "#6f6f6f", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12, fontFamily: "'IBM Plex Mono', monospace" }}>
                            Undang Anggota
                        </p>
                        <InviteMember
                            projectId={projectId}
                            isOwner={isOwner}
                        />
                    </div>
                        
                </div>
            </div>
        </>
    )
}