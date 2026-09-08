import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import EntryScreen from "../components/EntryScreen";

// Dynamically load ChatPanel client-side with an error boundary
const ChatPanel = dynamic(
  () =>
    import("../components/chat/ChatPanel").catch((err) => {
      return () => (
        <div
          style={{
            padding: "24px",
            color: "#f87171",
            background: "#05050b",
            height: "100vh",
            fontFamily: "monospace",
            fontSize: "13px",
          }}
        >
          <h3 style={{ color: "#22d3ee", fontSize: "16px", marginBottom: "8px" }}>
            🚨 Cipher Mount Exception
          </h3>
          <p style={{ marginBottom: "12px", color: "#94a3b8" }}>
            The client interface failed to initialize. Diagnostic trace below:
          </p>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              background: "#0f172a",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #334155",
            }}
          >
            {err.stack || err.message || err.toString()}
          </pre>
        </div>
      );
    }),
  {
    ssr: false,
    loading: () => <div style={{ height: "100vh", background: "#05050b" }} />,
  }
);

export default function Home() {
  const [entered, setEntered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("cipherEntered");
    if (seen === "true") {
      setEntered(true);
    }
    setReady(true);
  }, []);

  const handleEnter = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("cipherEntered", "true");
      setEntered(true);
      setLoading(false);
    }, 1200);
  };

  if (!ready) return null;

  if (!entered) {
    return <EntryScreen onEnter={handleEnter} loading={loading} />;
  }

  return (
    <div
      style={{
        height: "100vh",
        background: "#05050b",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ChatPanel />
    </div>
  );
}
