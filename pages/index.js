// pages/index.js
import { useState, useEffect } from "react";

export default function Home() {
  const [entered, setEntered] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("cipherEntered");
    if (seen === "true") {
      setEntered(true);
    }
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#05050b",
        color: "#ffffff",
        fontFamily: "monospace",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <h2 style={{ color: "#22d3ee", marginBottom: "12px" }}>
        ⚡ Cipher Engine Substrate
      </h2>
      <p style={{ color: "#94a3b8", marginBottom: "24px" }}>
        Status: Online | Ready for Chat & Entry components
      </p>

      <div
        style={{
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: "8px",
          padding: "16px",
          maxWidth: "480px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "13px", color: "#cbd5e1" }}>
          Engine runtime container compiled successfully.
        </p>
      </div>
    </div>
  );
}
