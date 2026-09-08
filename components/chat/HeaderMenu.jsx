// components/chat/HeaderMenu.js
import { useEffect, useState } from "react";

export default function HeaderMenu({ onNewChat }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasAccess = localStorage.getItem("cipher_dev_access") === "granted";
      if (hasAccess) {
        setUser({ email: "Architect" });
      }
    }
  }, []);

  return (
    <header className="cipher-header-inner">
      {/* LEFT — IDENTITY */}
      <div className="cipher-header-left">
        <div className="cipher-brand">
          <span className="brand-dot" />
          <span className="brand-title">CIPHER</span>
          <span className="brand-sub">CTS</span>
        </div>
      </div>

      {/* RIGHT — ACTIONS */}
      <div className="cipher-header-right">
        {onNewChat && (
          <button className="cipher-action-btn" onClick={onNewChat} title="Clear & Start New Session">
            + New Session
          </button>
        )}

        {user && (
          <div className="cipher-avatar-pill" title={`Node Operator: ${user.email}`}>
            <span className="avatar-dot" />
            <span className="avatar-label">{user.email}</span>
          </div>
        )}
      </div>

      <style jsx>{`
        .cipher-header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        .cipher-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .cipher-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
          letter-spacing: 0.1em;
          font-size: 14px;
        }

        .brand-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22d3ee;
          box-shadow: 0 0 10px #22d3ee;
        }

        .brand-title {
          color: #f8fafc;
        }

        .brand-sub {
          color: #22d3ee;
        }

        .cipher-header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .cipher-action-btn {
          background: rgba(30, 41, 59, 0.7);
          color: #94a3b8;
          border: 1px solid rgba(51, 65, 85, 0.7);
          padding: 6px 14px;
          border-radius: 6px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cipher-action-btn:hover {
          color: #22d3ee;
          border-color: rgba(34, 211, 238, 0.4);
          background: rgba(34, 211, 238, 0.1);
        }

        .cipher-avatar-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(51, 65, 85, 0.5);
          padding: 5px 10px;
          border-radius: 9999px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #cbd5e1;
        }

        .avatar-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 6px #10b981;
        }
      `}</style>
    </header>
  );
}
