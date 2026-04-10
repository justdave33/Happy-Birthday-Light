import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Add as many videos as you like here ──
const videos = [
  { src: "/video/wifevid1.mp4", label: "Video 1", caption: "A piece of us I never want to lose 🎞️" },
  { src: "/video/wifevid2.mp4", label: "Video 2", caption: "Every second with you was everything 💛" },
];

export default function VideoSection() {
  const [current, setCurrent]     = useState(0);
  const [playing, setPlaying]     = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const videoRefs = useRef([]);
  const total     = videos.length;

  // Pause all other videos when switching
  const go = (idx) => {
    const bounded = Math.max(0, Math.min(idx, total - 1));
    if (bounded === current) return;
    // Pause current
    const cur = videoRefs.current[current];
    if (cur) { cur.pause(); cur.currentTime = 0; }
    setPlaying(false);
    setCurrent(bounded);
  };

  // Touch / drag swipe
  const onTouchStart = (e) => setDragStart(e.touches[0].clientX);
  const onTouchEnd   = (e) => {
    if (dragStart === null) return;
    const delta = e.changedTouches[0].clientX - dragStart;
    if (Math.abs(delta) > 45) go(current + (delta < 0 ? 1 : -1));
    setDragStart(null);
  };
  const onMouseDown  = (e) => setDragStart(e.clientX);
  const onMouseUp    = (e) => {
    if (dragStart === null) return;
    const delta = e.clientX - dragStart;
    if (Math.abs(delta) > 45) go(current + (delta < 0 ? 1 : -1));
    setDragStart(null);
  };

  const togglePlay = () => {
    const vid = videoRefs.current[current];
    if (!vid) return;
    if (vid.paused) { vid.play(); setPlaying(true); }
    else            { vid.pause(); setPlaying(false); }
  };

  // Auto-pause when scrolled out of view
  useEffect(() => {
    const vid = videoRefs.current[current];
    if (!vid) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (!entry.isIntersecting && !vid.paused) { vid.pause(); setPlaying(false); } },
      { threshold: 0.2 }
    );
    obs.observe(vid);
    return () => obs.disconnect();
  }, [current]);

  return (
    <motion.div
      className="glass"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9 }}
    >
      <style>{`
        @keyframes vs-playPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(249,196,106,0.35); }
          50%      { box-shadow: 0 0 0 14px rgba(249,196,106,0); }
        }
        @keyframes vs-fadeIn { from{opacity:0} to{opacity:1} }
      `}</style>

      <h2 style={{ fontFamily: "Georgia, serif", marginBottom: "1rem" }}>Our Story 🎬</h2>

      {/* Swipeable track */}
      <div
        style={{ overflow: "hidden", borderRadius: "14px", cursor: total > 1 ? "grab" : "default", userSelect: "none" }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={(e) => dragStart !== null && onMouseUp(e)}
      >
        <div style={{
          display: "flex",
          transform: `translateX(-${current * 100}%)`,
          transition: "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}>
          {videos.map((v, i) => (
            <div key={i} style={{ minWidth: "100%", flexShrink: 0, position: "relative" }}>
              {/* Video element — only renders src when close to active (±1) to save bandwidth */}
              <div style={{ position: "relative", borderRadius: "14px", overflow: "hidden", background: "#000", aspectRatio: "16/9" }}>
                <video
                  ref={(el) => (videoRefs.current[i] = el)}
                  // Lazy: only set src for active and adjacent slides
                  src={Math.abs(i - current) <= 1 ? v.src : undefined}
                  preload={i === current ? "metadata" : "none"}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", borderRadius: "14px" }}
                  playsInline
                  onEnded={() => setPlaying(false)}
                  onClick={togglePlay}
                />

                {/* Overlay play button — shows when paused */}
                <AnimatePresence>
                  {(!playing || current !== i) && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ duration: 0.25 }}
                      onClick={i === current ? togglePlay : undefined}
                      style={{
                        position: "absolute", inset: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: "rgba(0,0,0,0.35)",
                        borderRadius: "14px",
                        cursor: i === current ? "pointer" : "default",
                      }}
                    >
                      <div style={{
                        width: "56px", height: "56px",
                        borderRadius: "50%",
                        background: "rgba(249,196,106,0.2)",
                        border: "1.5px solid rgba(249,196,106,0.65)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#f9c46a", fontSize: "1.4rem",
                        animation: i === current ? "vs-playPulse 2.5s ease-in-out infinite" : "none",
                        transition: "transform 0.15s",
                        paddingLeft: "3px", // optical centre for ▶
                      }}>
                        ▶
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Video counter pill */}
                {total > 1 && (
                  <div style={{
                    position: "absolute", top: 10, right: 12,
                    background: "rgba(0,0,0,0.55)", borderRadius: "12px",
                    padding: "3px 9px", fontSize: "0.62rem",
                    color: "rgba(255,255,255,0.7)", letterSpacing: "0.06em",
                    pointerEvents: "none",
                  }}>
                    {i + 1} / {total}
                  </div>
                )}
              </div>

              {/* Caption */}
              <p style={{
                fontSize: "0.75rem", fontStyle: "italic",
                fontFamily: "Georgia, serif",
                color: "rgba(255,255,255,0.5)",
                textAlign: "center", marginTop: "8px",
                animation: "vs-fadeIn 0.5s ease",
              }}>
                {v.caption}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation row — only shown when more than 1 video */}
      {total > 1 && (
        <div style={{ marginTop: "12px" }}>
          {/* Tab pills */}
          <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginBottom: "10px", flexWrap: "wrap" }}>
            {videos.map((v, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                style={{
                  padding: "5px 16px",
                  borderRadius: "20px",
                  background: i === current ? "rgba(249,196,106,0.15)" : "rgba(255,255,255,0.05)",
                  border: `0.5px solid ${i === current ? "rgba(249,196,106,0.4)" : "rgba(255,255,255,0.1)"}`,
                  color: i === current ? "rgba(249,196,106,0.9)" : "rgba(255,255,255,0.35)",
                  fontSize: "0.65rem", letterSpacing: "0.08em",
                  cursor: "pointer",
                  transition: "all 0.25s",
                  fontFamily: "'Lato', sans-serif",
                }}
              >
                {v.label}
              </button>
            ))}
          </div>

          {/* Prev / Next */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {[{ dir: -1, label: "← Previous", disabled: current === 0 }, { dir: 1, label: "Next →", disabled: current === total - 1 }].map(({ dir, label, disabled }) => (
              <button
                key={label}
                onClick={() => go(current + dir)}
                disabled={disabled}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "0.5px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  padding: "6px 14px",
                  color: disabled ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.5)",
                  fontSize: "0.7rem",
                  cursor: disabled ? "default" : "pointer",
                  transition: "all 0.2s",
                  fontFamily: "'Lato', sans-serif",
                }}
                onMouseOver={(e) => !disabled && (e.currentTarget.style.color = "#fff")}
                onMouseOut={(e)  => !disabled && (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}