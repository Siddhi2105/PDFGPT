import { useState, useRef, useEffect } from "react";
import axios from "axios";
const API = import.meta.env.VITE_API_URL;

export default function App() {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pdfs, setPdfs] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [selectedPdfName, setSelectedPdfName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [uploadError, setUploadError] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [showPdf, setShowPdf] = useState(false);
  const [copyIndex, setCopyIndex] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [charCount, setCharCount] = useState(0);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const d = darkMode;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => { loadPDFs(); }, []);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const loadPDFs = async () => {
    try {
      const res = await axios.get(`${API}/pdf-list`);
      setPdfs(res.data.files);
      if (res.data.files.length > 0 && !selectedPdfName) {
        setSelectedPdfName(res.data.files[0].name);
        setSelectedPdf(res.data.files[0].url);
      }
    } catch (e) { console.error(e); }
  };

  const uploadPDF = async () => {
    if (!file) return;
    setUploading(true);
    setUploadError("");
    setUploadSuccess("");
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(`${API}/upload`, formData);
      if (res.data.success) {
        await loadPDFs();
        setSelectedPdfName(file.name);
        setSelectedPdf(`${API}/pdfs/${file.name}`);
        setUploadSuccess(`"${file.name}" uploaded successfully`);
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setTimeout(() => setUploadSuccess(""), 3000);
      } else {
        setUploadError(res.data.error || "Upload failed");
      }
    } catch (e) {
      setUploadError("Upload failed. Is the backend running?");
    }
    setUploading(false);
  };

  const deletePDF = async (pdfName) => {

    if (!window.confirm(`Delete "${pdfName}"?`)) return;
    setPdfs((prev) => prev.filter((p) => p.name !== pdfName));
    if (selectedPdfName === pdfName) { setSelectedPdfName(""); setSelectedPdf(null); setShowPdf(false); }
    try {
      await axios.delete(`${API}/delete-pdf/${pdfName}`);
      await loadPDFs();
    } catch (e) { await loadPDFs(); }
  };

  const clearChat = async () => {
    try {
      await axios.post(`${API}/clear-chat`);
      setMessages([]);
    } catch (e) { console.error(e); }
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopyIndex(idx);
    setTimeout(() => setCopyIndex(null), 2000);
  };

  const askQuestion = async () => {
    if (!question.trim()) return;
    if (!selectedPdfName) { alert("Select a document first"); return; }
    const userMsg = { role: "user", content: question };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion("");
    setCharCount(0);
    setLoading(true);
    try {
      const res = await axios.post(`${API}/ask`, { question, pdf_name: selectedPdfName });
      if (res.data.success) {
        setMessages((prev) => [...prev, {
          role: "assistant",
          content: res.data.answer,
          sources: res.data.sources || [],
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: "⚠ " + res.data.error }]);
      }
    } catch (e) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Connection error. Is the backend running?" }]);
    }
    setLoading(false);
    inputRef.current?.focus();
  };

  const SUGGESTIONS = ["Summarize this document", "What are the key findings?", "List the main topics covered", "What conclusions are drawn?"];

  const c = {
    bg: d ? "#0a0a0a" : "#f5f5f3",
    sidebar: d ? "#111110" : "#ffffff",
    sidebarBorder: d ? "#1e1e1c" : "#e5e5e0",
    topbar: d ? "#111110" : "#ffffff",
    topbarBorder: d ? "#1e1e1c" : "#e5e5e0",
    chatBg: d ? "#0a0a0a" : "#f5f5f3",
    bubbleAI: d ? "#161614" : "#ffffff",
    bubbleAIBorder: d ? "#2a2a28" : "#e5e5e0",
    bubbleAIText: d ? "#c8c8c4" : "#2a2a28",
    bubbleUser: d ? "#0f1a2e" : "#dbeafe",
    bubbleUserBorder: d ? "#1e3a6e" : "#93c5fd",
    bubbleUserText: d ? "#bdd4f8" : "#1e3a6e",
    inputBg: d ? "#161614" : "#ffffff",
    inputBorder: d ? "#2a2a28" : "#e5e5e0",
    inputText: d ? "#e8e8e6" : "#1a1a18",
    placeholder: d ? "#444" : "#aaa",
    textPrimary: d ? "#e8e8e6" : "#1a1a18",
    textSecondary: d ? "#888" : "#666",
    textMuted: d ? "#444" : "#aaa",
    pdfItemHover: d ? "#1a1a18" : "#f0f0ee",
    pdfItemActive: d ? "#0f1a2e" : "#dbeafe",
    tagBg: d ? "#0f0f0e" : "#f0f0ee",
    tagBorder: d ? "#2a2a28" : "#e5e5e0",
    emptyIcon: d ? "#0f1a2e" : "#dbeafe",
    emptyIconBorder: d ? "#1e3a6e" : "#93c5fd",
    hintText: d ? "#2a2a28" : "#ccc",
    modelBg: d ? "#0f0f0e" : "#f5f5f3",
    modelBorder: d ? "#1e1e1c" : "#e5e5e0",
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%", background: c.bg, fontFamily: "'Inter', system-ui, sans-serif", color: c.textPrimary, overflow: "hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes docpulse { 0%,100%{opacity:0.2;transform:scale(0.8)} 50%{opacity:1;transform:scale(1)} }
        @keyframes fadein { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideup { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2a28; border-radius: 2px; }
        .pdf-item:hover .delete-btn { opacity: 1 !important; }
        .chip:hover { border-color: #2563eb !important; color: #60a5fa !important; }
        .msg-animate { animation: fadein 0.25s ease; }
        .send-btn:hover { background: #1d4ed8 !important; }
        .btn-ghost:hover { background: ${c.pdfItemHover} !important; color: ${c.textPrimary} !important; }
        textarea:focus { outline: none; }
        .source-tag:hover { border-color: #2563eb !important; color: #60a5fa !important; }
        .pdf-item { transition: background 0.15s; }
      `}</style>

      {/* ── Sidebar ── */}
      <div style={{ width: sidebarOpen ? 270 : 0, overflow: "hidden", transition: "width 0.25s ease", background: c.sidebar, borderRight: `0.5px solid ${c.sidebarBorder}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "18px 14px 14px", borderBottom: `0.5px solid ${c.sidebarBorder}` }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 30, height: 30, background: "#2563eb", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FileIcon size={15} color="white" />
            </div>
            <span style={{ fontSize: 16, fontWeight: 600, color: c.textPrimary, letterSpacing: "-0.3px", fontFamily: "'Inter', sans-serif" }}>DocMind</span>
            <span style={{ fontSize: 10, background: d ? "#0f1a2e" : "#dbeafe", color: "#60a5fa", border: `0.5px solid ${d ? "#1e3a6e" : "#93c5fd"}`, borderRadius: 4, padding: "2px 6px", marginLeft: 2, fontFamily: "'JetBrains Mono', monospace" }}>RAG</span>
          </div>

          {/* Upload */}
          <label style={{ display: "block", cursor: "pointer" }}>
            <input ref={fileInputRef} type="file" accept=".pdf" style={{ display: "none" }} onChange={(e) => setFile(e.target.files[0])} />
            {file ? (
              <div style={{ background: d ? "#0f1a2e" : "#dbeafe", border: `0.5px solid ${d ? "#1e3a6e" : "#93c5fd"}`, borderRadius: 8, padding: "8px 10px", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 12, color: "#60a5fa", fontFamily: "'JetBrains Mono', monospace" }}>{file.name}</span>
                <button onClick={(e) => { e.preventDefault(); uploadPDF(); }} disabled={uploading}
                  style={{ background: "#2563eb", color: "white", border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 12, cursor: "pointer", fontWeight: 500, whiteSpace: "nowrap" }}>
                  {uploading ? "..." : "Upload"}
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: "#2563eb", color: "white", border: "none", borderRadius: 8, padding: "9px 12px", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                <UploadIcon size={13} color="white" />
                <span>Upload PDF</span>
              </div>
            )}
          </label>

          {uploadError && <p style={{ fontSize: 11, color: "#e05454", marginTop: 6 }}>{uploadError}</p>}
          {uploadSuccess && <p style={{ fontSize: 11, color: "#30d158", marginTop: 6 }}>{uploadSuccess}</p>}
        </div>

        {/* PDF List */}
        <div style={{ padding: "10px 14px 4px", fontSize: 11, color: c.textMuted, letterSpacing: "0.5px", textTransform: "uppercase", fontWeight: 500 }}>
          Documents ({pdfs.length})
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "4px 8px" }}>
          {pdfs.length === 0 && <div style={{ padding: "12px 10px", fontSize: 13, color: c.textMuted }}>No documents yet</div>}
          {pdfs.map((pdf) => {
            const active = selectedPdfName === pdf.name;
            return (
              <div key={pdf.name} className="pdf-item" style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8, cursor: "pointer", background: active ? c.pdfItemActive : "transparent" }}
                onClick={() => { setSelectedPdfName(pdf.name); setSelectedPdf(pdf.url); }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: active ? "#2563eb" : c.textMuted, flexShrink: 0 }} />
                <span style={{ fontSize: 13, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: active ? "#60a5fa" : c.textSecondary }}>{pdf.name}</span>
                <button className="delete-btn" style={{ background: "none", border: "none", cursor: "pointer", opacity: 0, display: "flex", transition: "opacity 0.15s" }}
                  onClick={(e) => { e.stopPropagation(); deletePDF(pdf.name); }}>
                  <TrashIcon size={13} color="#e05454" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ padding: 12, borderTop: `0.5px solid ${c.sidebarBorder}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 10px", background: c.modelBg, border: `0.5px solid ${c.modelBorder}`, borderRadius: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#30d158" }} />
            <span style={{ fontSize: 11, color: c.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>gemini-2.5-flash · RAG</span>
          </div>
        </div>
      </div>

      {/* ── Main ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Topbar */}
        <div style={{ height: 52, background: c.topbar, borderBottom: `0.5px solid ${c.topbarBorder}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 6, display: "flex" }} onClick={() => setSidebarOpen(!sidebarOpen)}>
              <MenuIcon size={16} color={c.textSecondary} />
            </button>
            {selectedPdfName && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: c.tagBg, border: `0.5px solid ${c.tagBorder}`, borderRadius: 6, padding: "5px 10px", fontSize: 12, color: c.textSecondary }}>
                <FileIcon size={11} color={c.textMuted} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{selectedPdfName}</span>
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {messages.length > 0 && (
              <span style={{ fontSize: 11, color: c.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>{messages.filter(m => m.role === "user").length} questions</span>
            )}
            {selectedPdfName && (
              <button className="btn-ghost" style={{ background: "transparent", border: `0.5px solid ${c.tagBorder}`, color: c.textSecondary, borderRadius: 6, padding: "5px 12px", fontSize: 12, cursor: "pointer" }}
                onClick={() => setShowPdf(!showPdf)}>
                {showPdf ? "Hide PDF" : "View PDF"}
              </button>
            )}
            <button className="btn-ghost" style={{ background: "transparent", border: `0.5px solid ${c.tagBorder}`, color: "#e05454", borderRadius: 6, padding: "5px 12px", fontSize: 12, cursor: "pointer" }} onClick={clearChat}>
              Clear
            </button>
            <button onClick={() => setDarkMode(!d)} style={{ background: "none", border: `0.5px solid ${c.tagBorder}`, borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: 14 }}>
              {d ? "☀️" : "🌙"}
            </button>
          </div>
        </div>

        {/* Content area */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

          {/* Chat */}
          <div style={{ flex: 1, overflowY: "auto", padding: "28px 40px", display: "flex", flexDirection: "column", gap: 20, background: c.chatBg }}>

            {messages.length === 0 && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, marginTop: 60 }}>
                <div style={{ width: 56, height: 56, background: c.emptyIcon, border: `0.5px solid ${c.emptyIconBorder}`, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FileIcon size={26} color="#2563eb" />
                </div>
                <p style={{ fontSize: 20, fontWeight: 600, color: c.textPrimary, letterSpacing: "-0.3px" }}>Ask your document anything</p>
                <p style={{ fontSize: 13, color: c.textSecondary, textAlign: "center", maxWidth: 360, lineHeight: 1.7 }}>
                  {selectedPdfName ? `"${selectedPdfName}" is ready. Try one of the prompts below.` : "Upload a PDF from the sidebar to get started."}
                </p>
                {selectedPdfName && (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginTop: 6 }}>
                    {SUGGESTIONS.map((q) => (
                      <button key={q} className="chip" style={{ background: c.sidebar, border: `0.5px solid ${c.tagBorder}`, borderRadius: 20, padding: "7px 16px", fontSize: 12, color: c.textSecondary, cursor: "pointer", transition: "all 0.15s" }}
                        onClick={() => { setQuestion(q); inputRef.current?.focus(); }}>
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className="msg-animate" style={{ display: "flex", gap: 12, alignItems: "flex-start", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                {msg.role === "assistant" && (
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: c.emptyIcon, color: "#60a5fa", border: `0.5px solid ${c.emptyIconBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, flexShrink: 0, fontFamily: "'JetBrains Mono', monospace" }}>AI</div>
                )}
                <div style={{ maxWidth: 660 }}>
                  <div style={{ background: msg.role === "user" ? c.bubbleUser : c.bubbleAI, border: `0.5px solid ${msg.role === "user" ? c.bubbleUserBorder : c.bubbleAIBorder}`, borderRadius: 12, padding: "12px 16px", fontSize: 14, lineHeight: 1.75, color: msg.role === "user" ? c.bubbleUserText : c.bubbleAIText, fontFamily: "'Inter', sans-serif" }}>
                    {msg.content}
                  </div>

                  {/* Sources + actions */}
                  {msg.role === "assistant" && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                      {msg.sources && msg.sources.filter((src, idx, arr) => arr.findIndex(s => s.pdf === src.pdf && s.page === src.page) === idx).map((src, j) => (
                        <div key={j} className="source-tag" style={{ display: "flex", alignItems: "center", gap: 4, background: c.tagBg, border: `0.5px solid ${c.tagBorder}`, borderRadius: 4, padding: "3px 8px", fontSize: 11, color: c.textMuted, cursor: "default", transition: "all 0.15s", fontFamily: "'JetBrains Mono', monospace" }}>
                          <FileIcon size={10} color={c.textMuted} />
                          <span>p. {src.page}</span>
                        </div>
                      ))}
                      <button onClick={() => copyToClipboard(msg.content, i)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: copyIndex === i ? "#30d158" : c.textMuted, display: "flex", alignItems: "center", gap: 4, padding: "2px 6px" }}>
                        {copyIndex === i ? "✓ Copied" : <><CopyIcon size={11} color={c.textMuted} /> Copy</>}
                      </button>
                      {msg.timestamp && <span style={{ fontSize: 11, color: c.textMuted, marginLeft: "auto" }}>{msg.timestamp}</span>}
                    </div>
                  )}
                </div>
                {msg.role === "user" && (
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: c.tagBg, color: c.textSecondary, border: `0.5px solid ${c.tagBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, flexShrink: 0, fontFamily: "'JetBrains Mono', monospace" }}>U</div>
                )}
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: c.emptyIcon, color: "#60a5fa", border: `0.5px solid ${c.emptyIconBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, flexShrink: 0 }}>AI</div>
                <div style={{ background: c.bubbleAI, border: `0.5px solid ${c.bubbleAIBorder}`, borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 6 }}>
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <span key={i} style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%", background: "#2563eb", animation: `docpulse 1.4s ease-in-out ${delay}s infinite` }} />
                  ))}
                  <span style={{ fontSize: 12, color: c.textMuted, marginLeft: 4, fontFamily: "'JetBrains Mono', monospace" }}>Searching document...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* PDF Viewer Panel */}
          {showPdf && selectedPdf && (
            <div style={{ width: 420, borderLeft: `0.5px solid ${c.topbarBorder}`, display: "flex", flexDirection: "column", background: c.sidebar, flexShrink: 0 }}>
              <div style={{ padding: "10px 14px", borderBottom: `0.5px solid ${c.topbarBorder}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: c.textSecondary, fontFamily: "'JetBrains Mono', monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{selectedPdfName}</span>
                <button onClick={() => setShowPdf(false)} style={{ background: "none", border: "none", cursor: "pointer", color: c.textMuted, fontSize: 16, marginLeft: 8 }}>✕</button>
              </div>
              <iframe src={selectedPdf} title="PDF Viewer" style={{ flex: 1, border: "none", width: "100%" }} />
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{ padding: "14px 32px 18px", background: c.topbar, borderTop: `0.5px solid ${c.topbarBorder}`, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, background: c.inputBg, border: `0.5px solid ${c.inputBorder}`, borderRadius: 12, padding: "10px 14px", transition: "border-color 0.15s" }}
            onFocus={(e) => e.currentTarget.style.borderColor = "#2563eb"} onBlur={(e) => e.currentTarget.style.borderColor = c.inputBorder}>
            <textarea
              ref={inputRef}
              rows={1}
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 14, color: c.inputText, fontFamily: "'Inter', sans-serif", resize: "none", lineHeight: 1.6, maxHeight: 120, overflowY: "auto" }}
              placeholder={selectedPdfName ? "Ask anything about your document..." : "Upload a PDF to get started..."}
              value={question}
              disabled={!selectedPdfName || loading}
              onChange={(e) => { setQuestion(e.target.value); setCharCount(e.target.value.length); e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"; }}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); askQuestion(); } }}
            />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
              {charCount > 0 && <span style={{ fontSize: 10, color: c.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>{charCount}</span>}
              <button className="send-btn" style={{ width: 34, height: 34, background: "#2563eb", border: "none", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, opacity: (!selectedPdfName || loading) ? 0.4 : 1, transition: "background 0.15s" }}
                onClick={askQuestion} disabled={!selectedPdfName || loading}>
                <SendIcon size={14} color="white" />
              </button>
            </div>
          </div>
          <p style={{ fontSize: 11, color: c.hintText, marginTop: 8, textAlign: "center", fontFamily: "'JetBrains Mono', monospace" }}>
            Answers grounded in your document · Shift+Enter for new line · Powered by Gemini RAG
          </p>
        </div>
      </div>
    </div>
  );
}

function FileIcon({ size = 16, color = "currentColor" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM8 13h8v1H8v-1zm0 3h6v1H8v-1zm0-6h2v1H8v-1z" /></svg>;
}
function UploadIcon({ size = 16, color = "currentColor" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>;
}
function SendIcon({ size = 16, color = "currentColor" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" fill={color} stroke="none" /></svg>;
}
function TrashIcon({ size = 16, color = "currentColor" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6m4-6v6" /></svg>;
}
function MenuIcon({ size = 16, color = "currentColor" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>;
}
function CopyIcon({ size = 16, color = "currentColor" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>;
}