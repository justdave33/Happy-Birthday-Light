import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

// Reunion date — adjust if needed
const TARGET = new Date("2026-06-01T00:00:00");
// When she left — used for the progress bar
const START = new Date("2022-08-01T00:00:00");

function calcTime() {
  const diff = TARGET - new Date();
  if (diff <= 0) return null;
  return {
    days:  Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    mins:  Math.floor((diff / (1000 * 60)) % 60),
    secs:  Math.floor((diff / 1000) % 60),
    pct:   Math.max(4, Math.min(96, (1 - diff / (TARGET - START)) * 100)),
  };
}

function FlipUnit({ value, label }) {
  const [prev, setPrev] = useState(value);
  const [flip, setFlip] = useState(false);
  const str = String(value).padStart(2, "0");

  useEffect(() => {
    if (value !== prev) {
      setFlip(true);
      const t = setTimeout(() => { setPrev(value); setFlip(false); }, 280);
      return () => clearTimeout(t);
    }
  }, [value]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
      <div style={{
        position: "relative",
        minWidth: "68px",
        overflow: "hidden",
        borderRadius: "10px",
        background: "rgba(255,255,255,0.05)",
        border: "0.5px solid rgba(255,255,255,0.1)",
      }}>
        {/* Top half (static) */}
        <div style={{
          padding: "10px 8px 4px",
          textAlign: "center",
          fontFamily: "Georgia, serif",
          fontSize: "2.3rem",
          fontWeight: 700,
          color: "#fff",
          lineHeight: 1,
          borderBottom: "0.5px solid rgba(0,0,0,0.4)",
        }}>
          {str}
        </div>
        {/* Bottom half with flip animation */}
        <div style={{
          padding: "4px 8px 10px",
          textAlign: "center",
          fontFamily: "Georgia, serif",
          fontSize: "2.3rem",
          fontWeight: 700,
          color: "rgba(255,255,255,0.75)",
          lineHeight: 1,
          transform: flip ? "rotateX(-90deg)" : "rotateX(0deg)",
          transformOrigin: "top center",
          transition: flip ? "transform 0.28s ease-in" : "none",
          backfaceVisibility: "hidden",
        }}>
          {str}
        </div>
        {/* Shine line */}
        <div style={{
          position: "absolute",
          left: 0, right: 0,
          top: "50%",
          height: "0.5px",
          background: "rgba(0,0,0,0.5)",
          pointerEvents: "none",
        }} />
      </div>
      <span style={{
        fontSize: "0.6rem",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.3)",
      }}>
        {label}
      </span>
    </div>
  );
}

export default function Countdown() {
  const [time, setTime] = useState(calcTime);
  const prevSecsRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => setTime(calcTime()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) {
    return (
      <motion.div className="glass"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: "center" }}
      >
        <h2 style={{ fontFamily: "Georgia, serif" }}>The Wait Is Over ❤️</h2>
        <p style={{ opacity: 0.6, marginTop: "0.5rem" }}>Together at last. This is only the beginning.</p>
      </motion.div>
    );
  }

  return (
    <motion.div className="glass"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      style={{ textAlign: "center" }}
    >
      <style>{`
        @keyframes cd-glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.9; }
        }
      `}</style>

      {/* Title */}
      <div style={{
        fontSize: "0.68rem",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        opacity: 0.4,
        marginBottom: "1.4rem",
      }}>
        Until I See You Again ⏳
      </div>

      {/* Flip units */}
      <div style={{ display: "flex", gap: "8px", alignItems: "flex-end", justifyContent: "center", flexWrap: "wrap" }}>
        <FlipUnit value={time.days}  label="Days" />
        <div style={{ paddingBottom: "1.5rem", color: "rgba(255,255,255,0.2)", fontFamily: "Georgia,serif", fontSize: "1.8rem" }}>:</div>
        <FlipUnit value={time.hours} label="Hours" />
        <div style={{ paddingBottom: "1.5rem", color: "rgba(255,255,255,0.2)", fontFamily: "Georgia,serif", fontSize: "1.8rem" }}>:</div>
        <FlipUnit value={time.mins}  label="Mins" />
        <div style={{ paddingBottom: "1.5rem", color: "rgba(255,255,255,0.2)", fontFamily: "Georgia,serif", fontSize: "1.8rem" }}>:</div>
        <FlipUnit value={time.secs}  label="Secs" />
      </div>

      {/* Subtitle */}
      <p style={{
        fontFamily: "Georgia, serif",
        fontStyle: "italic",
        fontSize: "0.8rem",
        opacity: 0.45,
        marginTop: "1.2rem",
      }}>
        {time.days} days until we are together again ❤️
      </p>

      {/* Progress bar */}
      <div style={{ marginTop: "1.4rem" }}>
        <div style={{
          height: "3px",
          background: "rgba(255,255,255,0.08)",
          borderRadius: "2px",
          overflow: "hidden",
          position: "relative",
        }}>
          <div style={{
            height: "100%",
            width: `${time.pct}%`,
            background: "rgba(249,196,106,0.75)",
            borderRadius: "2px",
            transition: "width 1s linear",
            position: "relative",
          }}>
            {/* Glow dot at the tip */}
            <div style={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#f9c46a",
              animation: "cd-glow 2s ease-in-out infinite",
            }} />
          </div>
        </div>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "0.58rem",
          color: "rgba(255,255,255,0.2)",
          letterSpacing: "0.06em",
          marginTop: "5px",
        }}>
          <span>Aug 2022 — You left</span>
          <span>June 2026 — Together ✦</span>
        </div>
      </div>
    </motion.div>
  );
}