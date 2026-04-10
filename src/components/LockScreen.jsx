import { useEffect, useRef } from "react";
import config from "../config";

export default function LockScreen({ onUnlock }) {
  const starsRef = useRef(null);

  useEffect(() => {
    // Build twinkling stars
    const container = starsRef.current;
    if (!container) return;
    for (let i = 0; i < 50; i++) {
      const star = document.createElement("div");
      const size = Math.random() * 2.5 + 1;
      Object.assign(star.style, {
        position: "absolute",
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        background: "#fff",
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        opacity: 0,
        animation: `ls-twinkle ${2 + Math.random() * 4}s ease-in-out infinite`,
        animationDelay: `${Math.random() * 5}s`,
        "--max-op": 0.3 + Math.random() * 0.7,
      });
      container.appendChild(star);
    }
  }, []);

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div
      onClick={onUnlock}
      style={{
        minHeight: "100vh",
        background: "#0d0d12",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      <style>{`
        @keyframes ls-twinkle {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.3); }
        }
        @keyframes ls-lock-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes ls-hint-pulse {
          0%, 100% { opacity: 0.3; transform: translateY(0); }
          50% { opacity: 0.7; transform: translateY(-3px); }
        }
        @keyframes ls-swipe {
          0% { left: -60px; }
          100% { left: 110%; }
        }
        @keyframes ls-candle-flame {
          0%, 100% { transform: scaleY(1) scaleX(1); }
          50% { transform: scaleY(1.2) scaleX(0.85); }
        }
      `}</style>

      {/* Stars layer */}
      <div ref={starsRef} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />

      {/* Faint birthday cake silhouette at the bottom */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, opacity: 0.08, pointerEvents: "none" }}>
        <svg viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg" width="100%">
          <rect x="60" y="90" width="280" height="55" rx="8" fill="#c4796a"/>
          <rect x="40" y="118" width="320" height="42" rx="8" fill="#e8a87c"/>
          <rect x="80" y="72" width="240" height="42" rx="6" fill="#d4879e"/>
          <rect x="100" y="56" width="200" height="30" rx="5" fill="#c4796a"/>
          <rect x="130" y="43" width="5" height="18" rx="2" fill="#f9c46a"/>
          <rect x="165" y="40" width="5" height="21" rx="2" fill="#f9c46a"/>
          <rect x="200" y="42" width="5" height="19" rx="2" fill="#f9c46a"/>
          <rect x="235" y="39" width="5" height="22" rx="2" fill="#f9c46a"/>
          <rect x="264" y="43" width="5" height="18" rx="2" fill="#f9c46a"/>
          <ellipse cx="132.5" cy="41" rx="5.5" ry="8" fill="#FCDE5A" style={{animation:"ls-candle-flame 0.8s ease-in-out infinite"}}/>
          <ellipse cx="167.5" cy="38" rx="5.5" ry="8" fill="#F2A623" style={{animation:"ls-candle-flame 0.9s ease-in-out infinite 0.1s"}}/>
          <ellipse cx="202.5" cy="40" rx="5.5" ry="8" fill="#FCDE5A" style={{animation:"ls-candle-flame 0.75s ease-in-out infinite 0.2s"}}/>
          <ellipse cx="237.5" cy="37" rx="5.5" ry="8" fill="#F2A623" style={{animation:"ls-candle-flame 0.85s ease-in-out infinite 0.15s"}}/>
          <ellipse cx="266.5" cy="41" rx="5.5" ry="8" fill="#FCDE5A" style={{animation:"ls-candle-flame 0.8s ease-in-out infinite 0.25s"}}/>
        </svg>
      </div>

      {/* Time */}
      <div style={{
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize: "clamp(3.5rem, 15vw, 5.5rem)",
        color: "#fff",
        fontWeight: 600,
        lineHeight: 1,
        letterSpacing: "-0.02em",
      }}>
        {timeStr}
      </div>

      {/* Date */}
      <div style={{
        fontSize: "0.78rem",
        color: "rgba(255,255,255,0.4)",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        marginTop: "8px",
      }}>
        {dateStr}
      </div>

      {/* Lock icon */}
      <div style={{ marginTop: "3rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ animation: "ls-lock-bounce 2.5s ease-in-out infinite" }}>
          <svg width="40" height="46" viewBox="0 0 40 46" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="20" width="38" height="25" rx="7" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"/>
            <path d="M10 20V14C10 8.477 14.477 4 20 4C25.523 4 30 8.477 30 14V20" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            <circle cx="20" cy="31" r="4" fill="rgba(255,255,255,0.3)"/>
            <rect x="18.5" y="32" width="3" height="5" rx="1.5" fill="rgba(255,255,255,0.3)"/>
          </svg>
        </div>

        {/* Hint text */}
        <p style={{
          fontSize: "0.72rem",
          color: "rgba(255,255,255,0.35)",
          marginTop: "1.2rem",
          letterSpacing: "0.06em",
          animation: "ls-hint-pulse 3s ease-in-out infinite",
        }}>
          Tap anywhere — this is just for you, {config.herName} ✦
        </p>

        {/* Swipe line */}
        <div style={{
          width: "80px",
          height: "3px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "2px",
          marginTop: "1.5rem",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute",
            left: 0, top: 0,
            width: "40px", height: "100%",
            background: "rgba(255,255,255,0.55)",
            borderRadius: "2px",
            animation: "ls-swipe 2s ease-in-out infinite",
          }} />
        </div>
      </div>
    </div>
  );
}