// components/EntryScreen.js
export default function EntryScreen({ onEnter, loading }) {
  return (
    <div className={`entry-screen ${loading ? "loading" : ""}`}>
      <div className="entry-overlay" />

      <div className="entry-content">
        <h1>Cipher CTS</h1>
        <p>Sovereign Ternary Substrate</p>

        {!loading ? (
          <button onClick={onEnter} className="enter-btn">
            Enter Cipher
          </button>
        ) : (
          <div className="entry-loader">
            <div className="loader-ring" />
            <div className="loader-text">Initializing Substrate...</div>
          </div>
        )}
      </div>

      <style jsx>{`
        .entry-screen {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #02030a;
          color: #ffffff;
          font-family: monospace;
          z-index: 50;
        }

        .entry-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(34, 211, 238, 0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .entry-content {
          position: relative;
          z-index: 10;
          text-align: center;
          padding: 24px;
        }

        h1 {
          font-size: 2.5rem;
          letter-spacing: 0.15em;
          margin-bottom: 8px;
          color: #22d3ee;
          text-shadow: 0 0 20px rgba(34, 211, 238, 0.4);
        }

        p {
          font-size: 0.95rem;
          color: #94a3b8;
          letter-spacing: 0.08em;
          margin-bottom: 32px;
        }

        .enter-btn {
          padding: 14px 32px;
          background: rgba(34, 211, 238, 0.15);
          color: #22d3ee;
          border: 1px solid rgba(34, 211, 238, 0.5);
          border-radius: 8px;
          font-family: monospace;
          font-size: 1rem;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .enter-btn:hover {
          background: rgba(34, 211, 238, 0.25);
          box-shadow: 0 0 15px rgba(34, 211, 238, 0.4);
          transform: translateY(-1px);
        }

        .entry-loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .loader-ring {
          width: 38px;
          height: 38px;
          border: 3px solid rgba(34, 211, 238, 0.2);
          border-top-color: #22d3ee;
          border-radius: 50%;
          animation: spin 0.9s linear infinite;
        }

        .loader-text {
          font-size: 0.85rem;
          color: #38bdf8;
          letter-spacing: 0.1em;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
