"use client"

import { useState } from "react"

type CheckboxItem = { id: string; checked: boolean; text: string }
type LinkItem = { id: string; url: string; label: string }
type TextItem = { id: string; text: string }

type NoteBlock =
    | { type: "checkbox"; data: CheckboxItem }
    | { type: "link"; data: LinkItem }
    | { type: "text"; data: TextItem }

function parseNotes(raw: string): NoteBlock[] {
    if (!raw.trim()) return []
    return raw.split("\n").map((line, i): NoteBlock => {
        const id = String(i)
        const unchecked = line.match(/^- \[ \] (.*)/)
        const checked = line.match(/^- \[x\] (.*)/)
        const link = line.match(/^link: (.+?) \| (.+)/)
        const plainLink = line.match(/^(https?:\/\/.+)/)

        if (unchecked) return { type: "checkbox", data: { id, checked: false, text: unchecked[1] } }
        if (checked) return { type: "checkbox", data: { id, checked: true, text: checked[1] } }
        if (link) return { type: "link", data: { id, label: link[1], url: link[2] } }
        if (plainLink) return { type: "link", data: { id, label: plainLink[1], url: plainLink[1] } }
        return { type: "text", data: { id, text: line } }
    })
}

function serializeBlocks(blocks: NoteBlock[]): string {
    return blocks.map(b => {
        if (b.type === "checkbox") return `- [${b.data.checked ? "x" : " "}] ${b.data.text}`
        if (b.type === "link") return b.data.label === b.data.url ? b.data.url : `link: ${b.data.label} | ${b.data.url}`
        return b.data.text
    }).join("\n")
}

function renderTextWithLinks(text: string) {
    const urlRegex = /((?:https?:\/\/|www\.)[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/g
    const parts = text.split(urlRegex)
    return parts.map((part, i) => {
        if (i % 2 === 1) {
            const href = part.startsWith("http") ? part : `https://${part}`
            return (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                    style={{ color: "#0f62fe", textDecoration: "underline", wordBreak: "break-all" }}
                    onClick={e => e.stopPropagation()}
                >
                    {part}
                </a>
            )
        }
        return <span key={i}>{part}</span>
    })
}

export default function TaskNotepad({ initialNotes, onSave }: { initialNotes: string; onSave: (notes: string) => void }) {
    const [blocks, setBlocks] = useState<NoteBlock[]>(() => parseNotes(initialNotes))
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editingText, setEditingText] = useState("")
    const [showLinkForm, setShowLinkForm] = useState(false)
    const [linkForm, setLinkForm] = useState({ label: "", url: "" })

    const save = (newBlocks: NoteBlock[]) => {
        setBlocks(newBlocks)
        onSave(serializeBlocks(newBlocks))
    }

    const addCheckbox = () => {
        const id = Date.now().toString()
        const newBlock: NoteBlock = { type: "checkbox", data: { id, checked: false, text: "Item baru" } }
        save([...blocks, newBlock])
        setEditingId(id)
        setEditingText("Item baru")
    }

    const addText = () => {
        const id = Date.now().toString()
        const newBlock: NoteBlock = { type: "text", data: { id, text: "" } }
        save([...blocks, newBlock])
        setEditingId(id)
        setEditingText("")
    }

    const addLink = () => {
        if (!linkForm.url.trim()) return
        const id = Date.now().toString()
        const newBlock: NoteBlock = { type: "link", data: { id, label: linkForm.label || linkForm.url, url: linkForm.url } }
        save([...blocks, newBlock])
        setLinkForm({ label: "", url: "" })
        setShowLinkForm(false)
    }

    const toggleCheckbox = (id: string) => {
        save(blocks.map(b =>
            b.type === "checkbox" && b.data.id === id
                ? { type: "checkbox" as const, data: { ...b.data, checked: !b.data.checked } }
                : b
        ))
    }

    const updateBlock = (id: string, text: string) => {
        save(blocks.map(b =>
            b.data.id === id
                ? { ...b, data: { ...b.data, text } } as NoteBlock
                : b
        ))
    }

    const deleteBlock = (id: string) => {
        save(blocks.filter(b => b.data.id !== id))
    }

    return (
        <div style={{ marginTop: 8, borderTop: "1px solid #e0e0e0", paddingTop: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <p style={{ fontSize: 10, color: "#a8a8a8", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Catatan
                </p>
                <div style={{ display: "flex", gap: 4 }}>
                    <button
                        onClick={addText}
                        title="Tambah teks"
                        style={{ background: "none", border: "1px solid #e0e0e0", cursor: "pointer", padding: "2px 6px", fontSize: 11, color: "#525252", fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                        T
                    </button>
                    <button
                        onClick={addCheckbox}
                        title="Tambah checkbox"
                        style={{ background: "none", border: "1px solid #e0e0e0", cursor: "pointer", padding: "2px 6px", fontSize: 11, color: "#525252", fontFamily: "'IBM Plex Mono', monospace" }}
                    >
                        ☐
                    </button>
                </div>
            </div>

            {showLinkForm && (
                <div style={{ background: "#f4f4f4", padding: "10px", marginBottom: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                    <input
                        type="text"
                        placeholder="Label (opsional)"
                        value={linkForm.label}
                        onChange={e => setLinkForm({ ...linkForm, label: e.target.value })}
                        style={{ border: "none", borderBottom: "1px solid #8d8d8d", background: "transparent", outline: "none", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", padding: "4px 0", color: "#161616" }}
                    />
                    <input
                        type="url"
                        placeholder="https://..."
                        value={linkForm.url}
                        onChange={e => setLinkForm({ ...linkForm, url: e.target.value })}
                        style={{ border: "none", borderBottom: "1px solid #8d8d8d", background: "transparent", outline: "none", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", padding: "4px 0", color: "#161616" }}
                    />
                    <button
                        onClick={addLink}
                        style={{ background: "#0f62fe", border: "none", color: "#ffffff", padding: "6px 12px", fontSize: 11, fontFamily: "'IBM Plex Sans', sans-serif", cursor: "pointer", alignSelf: "flex-end" }}
                    >
                        Tambah
                    </button>
                </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {blocks.length === 0 && (
                    <p style={{ fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", color: "#c6c6c6" }}>
                        Belum ada catatan.
                    </p>
                )}

                {blocks.map(block => (
                    <div key={block.data.id} style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>

                        {block.type === "checkbox" && (
                            <>
                                <input
                                    type="checkbox"
                                    checked={block.data.checked}
                                    onChange={() => toggleCheckbox(block.data.id)}
                                    style={{ marginTop: 3, cursor: "pointer", accentColor: "#0f62fe", flexShrink: 0 }}
                                />
                                {editingId === block.data.id ? (
                                    <input
                                        autoFocus
                                        value={editingText}
                                        onChange={e => setEditingText(e.target.value)}
                                        onBlur={() => { updateBlock(block.data.id, editingText); setEditingId(null) }}
                                        onKeyDown={e => { if (e.key === "Enter") { updateBlock(block.data.id, editingText); setEditingId(null) } }}
                                        style={{ flex: 1, border: "none", borderBottom: "1px solid #0f62fe", outline: "none", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", background: "transparent", padding: "1px 0" }}
                                    />
                                ) : (
                                    <span
                                        onClick={() => { setEditingId(block.data.id); setEditingText(block.data.text) }}
                                        style={{ flex: 1, fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", color: block.data.checked ? "#a8a8a8" : "#525252", textDecoration: block.data.checked ? "line-through" : "none", cursor: "text", lineHeight: 1.6 }}
                                    >
                                        {block.data.text}
                                    </span>
                                )}
                            </>
                        )}

                        {block.type === "text" && (
                            <>
                                {editingId === block.data.id ? (
                                    <textarea
                                        autoFocus
                                        value={editingText}
                                        onChange={e => setEditingText(e.target.value)}
                                        onBlur={() => { updateBlock(block.data.id, editingText); setEditingId(null) }}
                                        rows={2}
                                        style={{ flex: 1, border: "none", borderBottom: "1px solid #0f62fe", outline: "none", resize: "none", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", background: "transparent", color: "#525252", padding: "1px 0" }}
                                    />
                                ) : (
                                    <span
                                        onClick={() => { setEditingId(block.data.id); setEditingText(block.data.text) }}
                                        style={{ flex: 1, fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", color: "#525252", cursor: "text", lineHeight: 1.6, whiteSpace: "pre-wrap" }}
                                    >
                                        {block.data.text
                                            ? renderTextWithLinks(block.data.text)
                                            : <span style={{ color: "#c6c6c6" }}>Klik untuk mengedit...</span>
                                        }
                                    </span>
                                )}
                            </>
                        )}

                        {block.type === "link" && (
                            <a href={block.data.url} target="_blank" rel="noopener noreferrer" style={{ flex: 1, fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", color: "#0f62fe", wordBreak: "break-all", lineHeight: 1.6 }}>
                                {block.data.label}
                            </a>
                        )}

                        <button
                            onClick={() => deleteBlock(block.data.id)}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "#c6c6c6", fontSize: 14, padding: "0 2px", lineHeight: 1, flexShrink: 0 }}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}