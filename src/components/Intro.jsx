import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import config from "../config";

const LINES = [
  { text: `Happy Birthday,`, size: "1rem", opacity: 0.55, weight: 300, family: "sans-serif" },
  { text: `${config.herName} ❤️`, size: "2.2rem", opacity: 1, weight: 700, family: "Georgia, serif", italic: true },
  { text: `Every moment with you`, size: "0.88rem", opacity: 0.5, weight: 300, family: "sans-serif" },
  { text: `still lives in me`, size: "0.88rem", opacity: 0.5, weight: 300, family: "sans-serif" },
];

export default function Intro({ onFinish }) {
  const particlesRef = useRef(null);
  const [step, setStep] = useState(0);

  // Step-reveal each line, then finish
  useEffect(() => {
    const timers = [];
    LINES.forEach((_, i) => {
      timers.push(setTimeout(() => setStep(i + 1), 600 + i * 700));
    });
    // Finish after all lines + a pause
    timers.push(setTimeout(onFinish, 600 + LINES.length * 700 + 1600));
    return () => timers.forEach(clearTimeout);
  }, []);

  // Floating confetti/particles
  useEffect(() => {
    const c = particlesRef.current;
    if (!c) return;
    const colors = ["#f9c46a", "#c4796a", "#e8a87c", "#d4879e", "#fff", "#f0d070"];
    const items = [];
    for (let i = 0; i < 28; i++) {
      const el = document.createElement("div");
      const size = Math.random() * 6 + 3;
      const isHeart = Math.random() > 0.7;
      Object.assign(el.style, {
        position: "absolute",
        left: `${Math.random() * 100}%`,
        bottom: `${Math.random() * 35}%`,
        width: isHeart ? "10px" : `${size}px`,
        height: isHeart ? "10px" : `${size}px`,
        borderRadius: isHeart ? "0" : "50%",
        fontSize: isHeart ? "10px" : "0",
        lineHeight: isHeart ? "10px" : "0",
        textAlign: "center",
        color: colors[Math.floor(Math.random() * colors.length)],
        background: isHeart ? "transparent" : colors[Math.floor(Math.random() * colors.length)],
        opacity: 0.65,
        animation: `intro-rise ${3 + Math.random() * 5}s ease-out infinite`,
        animationDelay: `-${Math.random() * 6}s`,
        pointerEvents: "none",
      });
      if (isHeart) el.textContent = "♥";
      items.push(el);
      c.appendChild(el);
    }
    return () => items.forEach((el) => el.remove());
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0d0d12",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      padding: "2rem",
    }}>
      <style>{`
        @keyframes intro-rise {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
        @keyframes intro-flame {
          0%, 100% { transform: scaleY(1) scaleX(1); }
          50% { transform: scaleY(1.2) scaleX(0.85); }
        }
        @keyframes intro-candle-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 0.18; transform: translateY(0); }
        }
      `}</style>

      {/* Particles */}
      <div ref={particlesRef} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />

      {/* Birthday cake at the bottom — atmospheric */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.18, y: 0 }}
        transition={{ duration: 1.4, delay: 0.3 }}
        style={{ position: "absolute", bottom: 0, left: 0, right: 0, pointerEvents: "none" }}
      >
        <svg viewBox="0 0 400 175" xmlns="http://www.w3.org/2000/svg" width="100%">
          {/* Plate */}
          <ellipse cx="200" cy="158" rx="175" ry="10" fill="#7a5030" opacity="0.5"/>
          {/* Bottom tier */}
          <rect x="50" y="100" width="300" height="58" rx="10" fill="#c4796a"/>
          <rect x="50" y="100" width="300" height="12" rx="10" fill="#d4879e" opacity="0.4"/>
          {/* Middle tier */}
          <rect x="80" y="68" width="240" height="40" rx="8" fill="#e8a87c"/>
          <rect x="80" y="68" width="240" height="10" rx="8" fill="#f0c090" opacity="0.4"/>
          {/* Top tier */}
          <rect x="110" y="44" width="180" height="30" rx="6" fill="#d4879e"/>
          <rect x="110" y="44" width="180" height="8" rx="6" fill="#eda0b8" opacity="0.4"/>
          {/* Frosting drips */}
          <ellipse cx="100" cy="100" rx="10" ry="8" fill="#fff" opacity="0.18"/>
          <ellipse cx="170" cy="100" rx="8" ry="7" fill="#fff" opacity="0.15"/>
          <ellipse cx="260" cy="100" rx="9" ry="7" fill="#fff" opacity="0.18"/>
          <ellipse cx="330" cy="100" rx="8" ry="6" fill="#fff" opacity="0.13"/>
          {/* Candles */}
          {[135, 163, 191, 219, 247].map((x, i) => (
            <g key={i}>
              <rect x={x} y={28} width={6} height={20} rx={3} fill="#f9c46a"/>
              <ellipse cx={x + 3} cy={26} rx={5.5} ry={8}
                fill={i % 2 === 0 ? "#FCDE5A" : "#F2A623"}
                style={{ animation: `intro-flame ${0.7 + i * 0.1}s ease-in-out infinite`, transformOrigin: `${x + 3}px 30px` }}
              />
            </g>
          ))}
          {/* Decorative dots */}
          {[80,120,160,200,240,280,320].map((x, i) => (
            <circle key={i} cx={x} cy={120} r={4} fill="#f9c46a" opacity="0.55"/>
          ))}
        </svg>
      </motion.div>

      {/* Text lines — step-revealed */}
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        <AnimatePresence>
          {LINES.slice(0, step).map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
              animate={{ opacity: line.opacity, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              style={{
                fontFamily: line.family,
                fontSize: line.size,
                fontWeight: line.weight,
                fontStyle: line.italic ? "italic" : "normal",
                color: "#fff",
                letterSpacing: i === 1 ? "0.02em" : "0.04em",
                lineHeight: 1.3,
              }}
            >
              {line.text}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Progress dots */}
        {step > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: "flex", gap: "6px", justifyContent: "center", marginTop: "1.4rem" }}
          >
            {LINES.map((_, i) => (
              <div key={i} style={{
                width: i < step ? "18px" : "6px",
                height: "5px",
                borderRadius: "3px",
                background: i < step ? "#f9c46a" : "rgba(255,255,255,0.2)",
                transition: "all 0.4s ease",
              }} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}