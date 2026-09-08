// components/chat/InputBar.js
import { useRef, useState } from "react";

export default function InputBar({ input, setInput, onSend, typing }) {
  const holdTimer = useRef(null);
  const decipherArmed = useRef(false);
  const longPressTriggered = useRef(false);
  const textareaRef = useRef(null);

  const [charging, setCharging] = useState(false);
  const [ripple, setRipple] = useState(false);

  function startHold() {
    decipherArmed.current = false;
    longPressTriggered.current = false;
    setCharging(true);

    holdTimer.current = setTimeout(() => {
      decipherArmed.current = true;
      longPressTriggered.current = true;
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate([20, 30, 20]);
      }
    }, 600);
  }

  function endHold() {
    clearTimeout(holdTimer.current);
    setCharging(false);

    if (longPressTriggered.current && !typing) {
      fireRipple();
      onSend({ forceDecipher: true });
    }

    decipherArmed.current = false;
    longPressTriggered.current = false;
  }

  function fireRipple() {
    setRipple(true);
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
    setTimeout(() => setRipple(false), 400);
  }

  function handleClick() {
    if (typing) return;
    if (!input.trim()) return;

    fireRipple();
    onSend({ forceDecipher: false });
  }

  function handleInput(e) {
    setInput(e.target.value);
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }

  return (
    <div className="cipher-input-wrap">
      <div className="cipher-input-shell">
        <div className="cipher-input-inner">
          <textarea
            ref={textareaRef}
            className="cipher-input-field"
            value={input}
            onChange={handleInput}
            placeholder="Talk to Cipher…"
            disabled={typing}
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.shiftKey) return;
              if (e.key === "Enter") {
                e.preventDefault();
                handleClick();
              }
            }}
          />

          <button
            disabled={typing || !input.trim()}
            title="Hold to Decipher"
            onTouchStart={startHold}
            onTouchEnd={endHold}
            onMouseDown={startHold}
            onMouseUp={endHold}
            onMouseLeave={endHold}
            onClick={handleClick}
            className={`cipher-send-btn ${charging ? "charging" : ""}`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>

            {ripple && <span className="ripple" />}
          </button>
        </div>
      </div>

      <style jsx>{`
        .cipher-input-wrap {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 16px 20px 24px 20px;
          background: linear-gradient(to top, rgba(2, 3, 10, 0.95) 70%, transparent);
          display: flex;
          justify-content: center;
          z-index: 40;
        }

        .cipher-input-shell {
          max-width: 720px;
          width: 100%;
        }

        .cipher-input-inner {
          display: flex;
          align-items: flex-end;
          gap: 10px;
          background: rgba(15, 23, 42, 0.85);
          border: 1px solid rgba(51, 65, 85, 0.6);
          border-radius: 16px;
          padding: 10px 14px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(12px);
          transition: border-color 0.2s ease;
        }

        .cipher-input-inner:focus-within {
          border-color: rgba(34, 211, 238, 0.5);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), 0 0 15px rgba(34, 211, 238, 0.15);
        }

        .cipher-input-field {
          flex: 1;
          background: transparent;
          border: none;
          color: #f8fafc;
          font-family: inherit;
          font-size: 14px;
          outline: none;
          padding: 4px 4px;
          resize: none;
          overflow-y: auto;
          max-height: 160px;
          line-height: 1.5;
        }

        .cipher-input-field::placeholder {
          color: #64748b;
        }

        .cipher-send-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #22d3ee;
          color: #02030a;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
          overflow: hidden;
        }

        .cipher-send-btn:hover:not(:disabled) {
          background: #38bdf8;
          transform: scale(1.03);
          box-shadow: 0 0 12px rgba(34, 211, 238, 0.4);
        }

        .cipher-send-btn:disabled {
          background: rgba(51, 65, 85, 0.5);
          color: #64748b;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .cipher-send-btn.charging {
          background: #f43f5e;
          box-shadow: 0 0 14px rgba(244, 63, 94, 0.6);
          transform: scale(0.95);
        }

        .ripple {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: rgba(255, 255, 255, 0.4);
          animation: rippleEffect 0.4s ease-out;
        }

        @keyframes rippleEffect {
          from {
            transform: scale(0);
            opacity: 1;
          }
          to {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
