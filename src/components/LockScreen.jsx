import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import config from "../config";

// ─────────────────────────────────────────────
// CONFIGURE THESE TWO VALUES:
const SECRET_QUESTION = "What is the name of the first place we went out to eat to?";
const SECRET_ANSWER   = "lilburn"; // lowercase, e.g. "perfect"
// ─────────────────────────────────────────────

// How loud a blow needs to be (0–100 scale). Lower = more sensitive.
const BLOW_THRESHOLD = 26;
// How many consecutive loud frames = a "blow"
const BLOW_FRAMES_NEEDED = 4;

export default function LockScreen({ onUnlock }) {
  const starsRef      = useRef(null);
  const audioCtxRef   = useRef(null);
  const analyserRef   = useRef(null);
  const streamRef     = useRef(null);
  const rafRef        = useRef(null);
  const blowFramesRef = useRef(0);

  const [time, setTime]           = useState("");
  const [date, setDate]           = useState("");
  const [listening, setListening] = useState(false);
  const [volume, setVolume]       = useState(0);
  const [micError, setMicError]   = useState("");
  const [candlesOut, setCandlesOut] = useState(0); // 0-5
  const [answer, setAnswer]       = useState("");
  const [qaError, setQaError]     = useState("");
  const [qaShake, setQaShake]     = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [unlockMsg, setUnlockMsg] = useState("");

  const totalCandles = 5;

  // ── Clock ──
  useEffect(() => {
    const tick = () => {
      const n = new Date();
      setTime(n.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }));
      setDate(n.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // ── Stars ──
  useEffect(() => {
    const c = starsRef.current;
    if (!c) return;
    const els = [];
    for (let i = 0; i < 55; i++) {
      const s = document.createElement("div");
      const sz = Math.random() * 2.5 + 0.8;
      Object.assign(s.style, {
        position: "absolute",
        width: `${sz}px`, height: `${sz}px`,
        borderRadius: "50%",
        background: "#fff",
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animation: `ls-twinkle ${2 + Math.random() * 4}s ease-in-out infinite`,
        animationDelay: `${Math.random() * 5}s`,
        opacity: 0,
      });
      c.appendChild(s);
      els.push(s);
    }
    return () => els.forEach((e) => e.remove());
  }, []);

  // ── Trigger unlock with a message ──
  const triggerUnlock = useCallback((msg) => {
    setUnlockMsg(msg);
    setUnlocking(true);
    stopMic();
    setTimeout(onUnlock, 2200);
  }, [onUnlock]);

  // ── Mic audio loop ──
  const listenLoop = useCallback(() => {
    if (!analyserRef.current) return;
    const data = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteTimeDomainData(data);
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      const v = (data[i] - 128) / 128;
      sum += v * v;
    }
    const rms = Math.sqrt(sum / data.length);
    const pct = Math.min(100, rms * 800);
    setVolume(Math.round(pct));

    if (pct > BLOW_THRESHOLD) {
      blowFramesRef.current += 1;
      if (blowFramesRef.current >= BLOW_FRAMES_NEEDED) {
        blowFramesRef.current = 0;
        setCandlesOut((prev) => {
          const next = prev + 1;
          if (next >= totalCandles) {
            setTimeout(() => triggerUnlock("🕯️ Candles out…\nWelcome in, my love ❤️"), 500);
          }
          return Math.min(next, totalCandles);
        });
      }
    } else {
      blowFramesRef.current = Math.max(0, blowFramesRef.current - 1);
    }

    rafRef.current = requestAnimationFrame(listenLoop);
  }, [triggerUnlock]);

  // ── Start mic ──
  const startMic = useCallback(async () => {
    setMicError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      ctx.createMediaStreamSource(stream).connect(analyser);
      setListening(true);
      blowFramesRef.current = 0;
      rafRef.current = requestAnimationFrame(listenLoop);
    } catch {
      setMicError("Mic not available on this device — use the secret question below.");
    }
  }, [listenLoop]);

  // ── Stop mic ──
  const stopMic = useCallback(() => {
    setListening(false);
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    audioCtxRef.current?.close();
    setVolume(0);
  }, []);

  const toggleMic = () => (listening ? stopMic() : startMic());

  // Cleanup on unmount
  useEffect(() => () => stopMic(), [stopMic]);

  // ── Secret question check ──
  const checkAnswer = () => {
    const val = answer.trim().toLowerCase();
    if (!val) { setQaError("Please enter an answer."); return; }
    const correct = SECRET_ANSWER.toLowerCase();
    if (val === correct || correct.includes(val) || val.includes(correct)) {
      setQaError("");
      triggerUnlock("✦ Welcome in, my love ❤️");
    } else {
      setQaError("Hmm… that doesn't seem right. Try again 🤍");
      setQaShake(true);
      setAnswer("");
      setTimeout(() => setQaShake(false), 500);
    }
  };

  // ── Candle flame component ──
  const Flame = ({ index, out }) => {
    const delay = index * 0.1;
    const colors = ["#FCDE5A", "#F2A623", "#FCDE5A", "#F2A623", "#FCDE5A"];
    if (out) return null;
    return (
      <ellipse
        cx={0} cy={0} rx={5.5} ry={8}
        fill={colors[index]}
        style={{
          transformOrigin: "0px 4px",
          animation: `ls-flame ${0.7 + index * 0.08}s ease-in-out infinite ${delay}s`,
        }}
      />
    );
  };

  const candleXs = [135, 163, 191, 219, 247];

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
      padding: "2rem 1.5rem",
      fontFamily: "'Lato', sans-serif",
    }}>
      <style>{`
        @keyframes ls-twinkle { 0%,100%{opacity:0.1;transform:scale(1)} 50%{opacity:0.75;transform:scale(1.3)} }
        @keyframes ls-lockBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes ls-hintPulse { 0%,100%{opacity:0.4;transform:translateY(0)} 50%{opacity:0.8;transform:translateY(-3px)} }
        @keyframes ls-flame { 0%,100%{transform:scaleY(1) scaleX(1)} 50%{transform:scaleY(1.25) scaleX(0.82)} }
        @keyframes ls-shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-7px)} 75%{transform:translateX(7px)} }
        @keyframes ls-micPulse { 0%,100%{box-shadow:0 0 0 0 rgba(249,196,106,0.4)} 50%{box-shadow:0 0 0 12px rgba(249,196,106,0)} }
        @keyframes ls-swipeShimmer { 0%{left:-60px} 100%{left:110%} }
        @keyframes ls-unlockReveal { from{opacity:0;transform:scale(0.88)} to{opacity:1;transform:scale(1)} }
        @keyframes ls-volPulse { 0%,100%{opacity:0.7} 50%{opacity:1} }
      `}</style>

      {/* Stars */}
      <div ref={starsRef} style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }} />

      {/* Birthday cake — bottom of screen */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.2, y: 0 }}
        transition={{ duration: 1.2 }}
        style={{ position: "absolute", bottom: 0, left: 0, right: 0, pointerEvents: "none", zIndex: 1 }}
      >
        <svg viewBox="0 0 400 175" xmlns="http://www.w3.org/2000/svg" width="100%">
          <ellipse cx="200" cy="162" rx="175" ry="9" fill="#7a5030" opacity="0.5"/>
          <rect x="50" y="100" width="300" height="58" rx="10" fill="#c4796a"/>
          <rect x="50" y="100" width="300" height="12" rx="10" fill="#d4879e" opacity="0.4"/>
          <rect x="80" y="68"  width="240" height="40" rx="8"  fill="#e8a87c"/>
          <rect x="80" y="68"  width="240" height="10" rx="8"  fill="#f0c090" opacity="0.4"/>
          <rect x="110" y="44" width="180" height="30" rx="6"  fill="#d4879e"/>
          <rect x="110" y="44" width="180" height="8"  rx="6"  fill="#eda0b8" opacity="0.4"/>
          {/* Frosting dots */}
          {[90,150,210,270,330].map((x, i) => (
            <circle key={i} cx={x} cy={120} r={5} fill="#fff" opacity="0.14"/>
          ))}
          {/* Candles + flames */}
          {candleXs.map((x, i) => (
            <g key={i}>
              <rect x={x - 3} y={28} width={6} height={20} rx={3} fill="#f9e0a0"/>
              <g transform={`translate(${x}, 24)`}>
                <Flame index={i} out={i < candlesOut} />
              </g>
            </g>
          ))}
        </svg>
      </motion.div>

      {/* Main content */}
      <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: "340px", display: "flex", flexDirection: "column", alignItems: "center", gap: "0" }}>

        {/* Clock */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: "center", marginBottom: "1.5rem" }}
        >
          <div style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "clamp(3.2rem, 16vw, 5rem)",
            color: "#fff",
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}>
            {time}
          </div>
          <div style={{
            fontSize: "0.7rem",
            color: "rgba(255,255,255,0.38)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginTop: "6px",
          }}>
            {date}
          </div>
        </motion.div>

        {/* Candles blown counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ display: "flex", gap: "8px", marginBottom: "1.2rem" }}
        >
          {Array.from({ length: totalCandles }).map((_, i) => (
            <motion.div
              key={i}
              animate={{ scale: i < candlesOut ? [1, 1.4, 1] : 1 }}
              transition={{ duration: 0.35 }}
              style={{
                width: "10px", height: "10px",
                borderRadius: "50%",
                background: i < candlesOut ? "rgba(255,255,255,0.15)" : "#f9c46a",
                border: i < candlesOut ? "0.5px solid rgba(255,255,255,0.2)" : "none",
                transition: "background 0.4s, transform 0.3s",
                boxShadow: i < candlesOut ? "none" : "0 0 6px rgba(249,196,106,0.6)",
              }}
            />
          ))}
        </motion.div>

        {/* Blow hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{
            fontSize: "0.82rem",
            color: "rgba(255,255,255,0.45)",
            textAlign: "center",
            letterSpacing: "0.04em",
            animation: "ls-hintPulse 3s ease-in-out infinite",
            marginBottom: "1rem",
          }}
        >
          {candlesOut === 0
            ? `🎂 Blow out all ${totalCandles} candles to unlock`
            : candlesOut < totalCandles
            ? `🕯️ ${totalCandles - candlesOut} candle${totalCandles - candlesOut > 1 ? "s" : ""} left — keep blowing!`
            : "🎉 All candles out!"}
        </motion.p>

        {/* Mic button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, type: "spring" }}
          onClick={toggleMic}
          style={{
            background: listening ? "rgba(249,196,106,0.15)" : "rgba(255,255,255,0.07)",
            border: `0.5px solid ${listening ? "rgba(249,196,106,0.45)" : "rgba(255,255,255,0.18)"}`,
            borderRadius: "50%",
            width: "54px", height: "54px",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            fontSize: "1.3rem",
            animation: listening ? "ls-micPulse 1.2s ease-in-out infinite" : "none",
            transition: "background 0.2s, border-color 0.2s",
            marginBottom: "0.6rem",
          }}
        >
          {listening ? "🎙️" : "🎤"}
        </motion.button>

        {/* Volume bar */}
        <div style={{ width: "130px", height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "2px", overflow: "hidden", marginBottom: "4px" }}>
          <div style={{
            height: "100%",
            width: `${volume}%`,
            background: volume > BLOW_THRESHOLD ? "#f9c46a" : "rgba(255,255,255,0.4)",
            borderRadius: "2px",
            transition: "width 0.08s, background 0.2s",
          }} />
        </div>
        <p style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.22)", marginBottom: "0.3rem", letterSpacing: "0.08em" }}>
          {listening ? "listening… blow now! 💨" : micError || "tap 🎤 then blow into the mic"}
        </p>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", margin: "1rem 0 0.9rem" }}>
          <div style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,0.1)" }} />
          <span style={{ fontSize: "0.63rem", color: "rgba(255,255,255,0.22)", letterSpacing: "0.1em" }}>or answer a secret question</span>
          <div style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,0.1)" }} />
        </div>

        {/* Secret question */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <p style={{
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            fontSize: "0.8rem",
            color: "rgba(255,255,255,0.45)",
            textAlign: "center",
            lineHeight: 1.55,
          }}>
            "{SECRET_QUESTION}"
          </p>

          <motion.input
            animate={qaShake ? { x: [-6, 6, -6, 6, 0] } : { x: 0 }}
            transition={{ duration: 0.4 }}
            type="text"
            value={answer}
            onChange={(e) => { setAnswer(e.target.value); setQaError(""); }}
            onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
            placeholder="your answer…"
            autoComplete="off"
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.05)",
              border: `0.5px solid ${qaError ? "rgba(200,80,80,0.5)" : "rgba(255,255,255,0.14)"}`,
              borderRadius: "10px",
              padding: "0.65rem 0.9rem",
              color: "#fff",
              fontSize: "0.82rem",
              fontFamily: "'Lato', sans-serif",
              outline: "none",
              transition: "border-color 0.2s",
            }}
          />

          {qaError && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ fontSize: "0.68rem", color: "rgba(220,100,100,0.85)", textAlign: "center" }}
            >
              {qaError}
            </motion.p>
          )}

          <button
            onClick={checkAnswer}
            style={{
              background: "rgba(249,196,106,0.1)",
              border: "0.5px solid rgba(249,196,106,0.3)",
              borderRadius: "10px",
              padding: "0.62rem",
              color: "rgba(249,196,106,0.9)",
              fontSize: "0.78rem",
              cursor: "pointer",
              letterSpacing: "0.07em",
              fontFamily: "'Lato', sans-serif",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "rgba(249,196,106,0.2)"}
            onMouseOut={(e) => e.currentTarget.style.background = "rgba(249,196,106,0.1)"}
          >
            Unlock ✦
          </button>
        </div>

        {/* Swipe bar */}
        <div style={{ width: "80px", height: "3px", background: "rgba(255,255,255,0.08)", borderRadius: "2px", marginTop: "2rem", position: "relative", overflow: "hidden" }}>
          <div style={{
            position: "absolute", left: 0, top: 0,
            width: "40px", height: "100%",
            background: "rgba(255,255,255,0.45)",
            borderRadius: "2px",
            animation: "ls-swipeShimmer 2.2s ease-in-out infinite",
          }} />
        </div>
      </div>

      {/* Unlock overlay */}
      <AnimatePresence>
        {unlocking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              position: "absolute", inset: 0, zIndex: 20,
              background: "#0d0d12",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "1.4rem",
                fontStyle: "italic",
                color: "#f9c46a",
                textAlign: "center",
                lineHeight: 1.6,
                whiteSpace: "pre-line",
              }}
            >
              {unlockMsg}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}