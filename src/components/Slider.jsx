import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

const images = [
  { src: "/images/wife1.jpg",       caption: "A moment I never want to forget ✨" },
  { src: "/images/wife2.jpg",       caption: "Every smile, every laugh — all ours 💛" },
  { src: "/images/wife3.jpg",       caption: "The laughter that still echoes ❤️" },
  { src: "/images/wife4.jpg",       caption: "Two hearts, one story 🌸" },
  { src: "/images/wife17.jpg",      caption: "Miles apart but always together 🌍" },
  { src: "/images/wife6.jpg",       caption: "The light in my every day ☀️" },
  { src: "/images/wife7.jpg",       caption: "My favourite person in the world 🌍" },
  { src: "/images/wife8.jpg",       caption: "Still the one I choose every time 💫" },
  { src: "/images/wife9.jpg",       caption: "Home is wherever you are 🏡" },
  { src: "/images/wife10.jpg",      caption: "Growing with you has been my greatest gift 🌱" },
  { src: "/images/wife11.jpg",      caption: "Your smile makes everything better 😊" },
  { src: "/images/wife12.jpg",      caption: "The memories we've made together ✨" },
  { src: "/images/wife13.jpg",      caption: "Through everything — still us 💑" },
  { src: "/images/wife14.jpg",      caption: "The love that time and distance can't touch 💖" },
  { src: "/images/wife15.jpg",      caption: "My forever person ♾️" },
  { src: "/images/wife18.jpg",      caption: "Beautiful inside and out 🌺" },
  { src: "/images/wifekiss.jpg",    caption: "This one is my favourite 😍" },
  { src: "/images/wifemarriage14.jpg", caption: "The day I became the luckiest man alive 💍" },
];

const AUTO_DELAY = 3000;

export default function Slider() {
  const [current, setCurrent]   = useState(0);
  const [loaded, setLoaded]     = useState({});
  const [dragging, setDragging] = useState(false);
  const dragStartX  = useRef(0);
  const autoTimer   = useRef(null);
  const total       = images.length;

  const go = useCallback((index) => {
    setCurrent(((index % total) + total) % total);
  }, [total]);

  // Autoplay
  const startAuto = useCallback(() => {
    clearInterval(autoTimer.current);
    autoTimer.current = setInterval(() => go(current + 1), AUTO_DELAY);
  }, [current, go]);

  useEffect(() => {
    startAuto();
    return () => clearInterval(autoTimer.current);
  }, [current]);

  // Touch / mouse drag
  const onDragStart = (clientX) => { dragStartX.current = clientX; setDragging(true); clearInterval(autoTimer.current); };
  const onDragEnd   = (clientX) => {
    if (!dragging) return;
    setDragging(false);
    const delta = clientX - dragStartX.current;
    if (Math.abs(delta) > 40) go(current + (delta < 0 ? 1 : -1));
  };

  // Preload current ±1
  useEffect(() => {
    [-1, 0, 1].forEach((offset) => {
      const idx = ((current + offset) % total + total) % total;
      if (!loaded[idx]) {
        const img = new Image();
        img.src = images[idx].src;
        img.onload = () => setLoaded((p) => ({ ...p, [idx]: true }));
      }
    });
  }, [current]);

  return (
    <motion.div
      className="glass"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9 }}
    >
      <style>{`
        @keyframes sl-shimmer {
          0%   { background-position: -300px 0; }
          100% { background-position:  300px 0; }
        }
        .sl-img { transition: opacity 0.4s ease; }
        .sl-img.loading { opacity: 0; }
      `}</style>

      <h2 style={{ fontFamily: "Georgia, serif", marginBottom: "1rem" }}>Our Memories 💞</h2>

      {/* Main stage */}
      <div
        style={{ position: "relative", borderRadius: "14px", overflow: "hidden", height: "300px", cursor: dragging ? "grabbing" : "grab", userSelect: "none" }}
        onMouseDown={(e) => onDragStart(e.clientX)}
        onMouseUp={(e)   => onDragEnd(e.clientX)}
        onMouseLeave={(e) => dragging && onDragEnd(e.clientX)}
        onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
        onTouchEnd={(e)  => onDragEnd(e.changedTouches[0].clientX)}
      >
        {/* Skeleton shimmer while loading */}
        {!loaded[current] && (
          <div style={{
            position: "absolute", inset: 0, borderRadius: "14px",
            background: "linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)",
            backgroundSize: "300px 100%",
            animation: "sl-shimmer 1.4s ease-in-out infinite",
          }} />
        )}

        <img
          key={current}
          src={images[current].src}
          alt={`Memory ${current + 1}`}
          className={`sl-img ${loaded[current] ? "" : "loading"}`}
          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "14px", display: "block" }}
          onLoad={() => setLoaded((p) => ({ ...p, [current]: true }))}
          draggable={false}
        />

        {/* Dark gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)", borderRadius: "14px", pointerEvents: "none" }} />

        {/* Caption */}
        <p style={{
          position: "absolute", bottom: 12, left: 14, right: 14,
          color: "#fff", fontSize: "0.75rem", fontStyle: "italic",
          fontFamily: "Georgia, serif", opacity: 0.85, letterSpacing: "0.03em",
          pointerEvents: "none",
          animation: "fadeIn 0.5s ease",
        }}>
          {images[current].caption}
        </p>

        {/* Counter pill */}
        <div style={{
          position: "absolute", top: 10, right: 12,
          background: "rgba(0,0,0,0.5)", borderRadius: "12px",
          padding: "3px 9px", fontSize: "0.62rem",
          color: "rgba(255,255,255,0.7)", letterSpacing: "0.06em",
        }}>
          {current + 1} / {total}
        </div>

        {/* Nav arrows */}
        {[{ dir: -1, side: "left", label: "‹" }, { dir: 1, side: "right", label: "›" }].map(({ dir, side, label }) => (
          <button
            key={side}
            onClick={(e) => { e.stopPropagation(); go(current + dir); }}
            style={{
              position: "absolute", top: "50%", transform: "translateY(-50%)",
              [side]: "10px",
              background: "rgba(0,0,0,0.45)",
              border: "0.5px solid rgba(255,255,255,0.15)",
              borderRadius: "50%",
              width: "36px", height: "36px",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "rgba(255,255,255,0.85)", fontSize: "1.1rem",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.72)"}
            onMouseOut={(e)  => e.currentTarget.style.background = "rgba(0,0,0,0.45)"}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Dot indicators */}
      <div style={{ display: "flex", justifyContent: "center", gap: "5px", marginTop: "10px", flexWrap: "wrap" }}>
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            style={{
              width: i === current ? "18px" : "5px",
              height: "5px",
              borderRadius: i === current ? "3px" : "50%",
              background: i === current ? "#f9c46a" : "rgba(255,255,255,0.2)",
              border: "none", cursor: "pointer", padding: 0,
              transition: "all 0.3s ease",
              boxShadow: i === current ? "0 0 6px rgba(249,196,106,0.5)" : "none",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}