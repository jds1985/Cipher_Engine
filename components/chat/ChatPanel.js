import { useState, useRef, useEffect } from "react";
import HeaderMenu from "./HeaderMenu";
import MessageList from "./MessageList";
import InputBar from "./InputBar";
import { bootCipherEngine, generateCipherResponse } from "../../lib/cipherEngine";

const MEMORY_KEY = "cipher_local_history";
const MEMORY_LIMIT = 50;

export default function ChatPanel() {
  const [tier] = useState("builder");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  // Engine state tracking
  const [engineLoaded, setEngineLoaded] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [streamLabel, setStreamLabel] = useState("");

  // Layout UI states
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showMemory, setShowMemory] = useState(false);

  const bottomRef = useRef(null);
  const sendingRef = useRef(false);

  /* 1. Local history load */
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(MEMORY_KEY);
      const parsed = saved ? JSON.parse(saved) : null;
      if (Array.isArray(parsed)) {
        setMessages(parsed.slice(-MEMORY_LIMIT));
      }
    } catch (err) {
      console.error("Failed to load local chat history:", err);
    }
  }, []);

  /* 2. Auto-scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing]);

  /* 3. Boot Engine */
  const bootLocalEngine = async () => {
    try {
      if (typeof window !== "undefined" && window.caches) {
        await caches.delete("transformers-cache");
      }

      setDownloadProgress(1);
      setStreamLabel("Connecting to system shards...");

      await bootCipherEngine({
        onProgress: (update) => {
          if (update && typeof update.pct === "number") {
            setDownloadProgress(update.pct);
            if (update.msg) setStreamLabel(update.msg);
          }
        },
      });

      setStreamLabel("");
      setEngineLoaded(true);
    } catch (err) {
      setDownloadProgress(0);
      setStreamLabel("");
      console.error("Engine boot error:", err);
      alert("Boot Error: " + (err.message || err.toString()));
    }
  };

  /* 4. Chat Management */
  function clearChat() {
    try {
      localStorage.removeItem(MEMORY_KEY);
    } catch {}
    setMessages([]);
    setSelectedIndex(null);
    setShowMemory(false);
  }

  function handleSelectMessage(i, options = {}) {
    setSelectedIndex((prev) => (prev === i ? prev : i));
    setShowMemory(!!options.openMemory);
  }

  /* 5. Inference */
  async function sendMessage(options = {}) {
    if (sendingRef.current || !engineLoaded) return;

    const isQuickAction = Boolean(options.quickAction);
    const text = isQuickAction ? options.quickAction : input.trim();
    if (!text) return;

    sendingRef.current = true;
    setTyping(true);

    await new Promise((resolve) => setTimeout(resolve, 150));

    const userMessage = { role: "user", content: text };

    if (!isQuickAction) {
      setInput("");
      setMessages((m) => [
        ...m,
        userMessage,
        { role: "assistant", content: "", modelUsed: "Cipher Substrate", memoryInfluence: [] },
      ]);
    }

    try {
      const streamedReply = await generateCipherResponse(text);

      setMessages((m) => {
        const next = [...m];
        next[next.length - 1].content = streamedReply;

        if (typeof window !== "undefined") {
          localStorage.setItem(MEMORY_KEY, JSON.stringify(next.slice(-MEMORY_LIMIT)));
        }
        return next;
      });
    } catch (e) {
      console.error("Inference execution exception:", e);
    } finally {
      setTyping(false);
      sendingRef.current = false;
    }
  }

  return (
    <div className="cipher-wrap">
      {/* Top Header */}
      <div className="cipher-floating-header">
        <HeaderMenu onNewChat={clearChat} />
      </div>

      {/* Floating HUD Side Pills */}
      <div className="cipher-side-tabs">
        <div className="cipher-tab-pill">
          <span className="dot" />
          <span>Sovereign Substrate</span>
        </div>
        <div className="cipher-tab-pill">
          <span>Mode: {engineLoaded ? "Offline Active" : "Standby"}</span>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="cipher-main">
        <div className="cipher-chat">
          {!engineLoaded ? (
            <div className="bg-slate-900/80 border border-slate-700/50 p-6 rounded-xl text-center max-w-sm mx-auto my-16 shadow-2xl">
              <h3 className="text-xl font-bold text-cyan-400 mb-2">Initialize Sovereign Engine</h3>
              <p className="text-xs text-slate-400 mb-6">
                Boot Cipher's custom ternary weights directly onto your local graphics hardware. 
                Once streamed, your processing engine functions completely offline.
              </p>

              {downloadProgress > 0 && (
                <div style={{ width: "100%", background: "#1e293b", height: "6px", borderRadius: "999px", marginBottom: "16px", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${downloadProgress}%`,
                      background: "linear-gradient(90deg, #22d3ee, #3b82f6)",
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              )}

              <button
                onClick={bootLocalEngine}
                disabled={downloadProgress > 0}
                className="w-full py-4 bg-slate-800/90 border border-slate-700/50 rounded-lg text-sm font-semibold transition text-white"
              >
                {downloadProgress > 0 ? (
                  <span>{streamLabel || "Streaming Substrate..."}</span>
                ) : (
                  "Cold Boot Cipher Engine"
                )}
              </button>
            </div>
          ) : (
            <MessageList
              messages={messages}
              bottomRef={bottomRef}
              onSelectMessage={handleSelectMessage}
              selectedIndex={selectedIndex}
              showMemory={showMemory}
              tier={tier}
              typing={typing}
              onQuickAction={(prompt, content) => {
                sendMessage({ quickAction: prompt, target: content });
              }}
            />
          )}
        </div>
      </div>

      {/* Input Bar */}
      <div className="cipher-input-wrap">
        <InputBar
          input={input}
          setInput={setInput}
          onSend={sendMessage}
          typing={typing || !engineLoaded}
        />
      </div>
    </div>
  );
}
