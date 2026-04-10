import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const events = [
  {
    side: "left",
    accent: "start",
    label: "The Beginning",
    title: "2019 The Day Our Story Started",
    text: "Two souls found each other, and nothing was ever the same again. That first moment was the seed of everything we've become.",
  },
  {
    side: "right",
    accent: "canada",
    label: "August 2022",
    title: "You Traveled to Canada 🇨🇦",
    text: "Miles apart, but never truly separated. Distance tested us in ways we never expected — and still, we held on.",
  },
  {
    side: "left",
    accent: "marry",
    label: "Marriage",
    title: "The Day You Became My Forever",
    text: "I made a promise in front of everyone I love — and I meant every word. That day, you became my home.",
  },
 
  {
    side: "right",
    accent: "now",
    label: "Today",
    title: "Still Loving You, Still Choosing You",
    text: "Four years of distance, and my heart hasn't wavered once. Less than 5 months until we're together again. I'm counting every day.",
  },
  {
    side: "left",
    accent: "future",
    label: "Coming Soon",
    title: "Our Life Together in Canada",
    text: "The life we dreamed is almost here. A home, a future, a family — everything we've waited for, just around the corner.",
  },
];

const accentColors = {
  start:  { dot: "#c4796a", stripe: "#c4796a" },
  marry:  { dot: "#a07840", stripe: "#a07840" },
  canada: { dot: "#5a7fa8", stripe: "#5a7fa8" },
  now:    { dot: "#6a9e7f", stripe: "#6a9e7f" },
  future: { dot: "#9a72b8", stripe: "#9a72b8" },
};

export default function Timeline() {
  const cardRefs = useRef([]);

  useEffect(() => {
    const observers = cardRefs.current.map((el, i) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => el.classList.add("tl-visible"), i * 180);
            obs.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o && o.disconnect());
  }, []);

  return (
    <div className="glass" style={{ position: "relative", padding: "2rem 1rem 2.5rem" }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 600, fontSize: "1.4rem" }}>
          Our Journey Together 🕰️
        </h2>
        <p style={{ fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.45, marginTop: 4 }}>
          Every moment, written in love
        </p>
      </div>

      {/* Spine */}
      <div style={{
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        top: 140,
        bottom: 80,
        width: 1,
        background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.18) 8%, rgba(255,255,255,0.18) 92%, transparent)",
      }} />

      {/* Events */}
      <div style={{ position: "relative" }}>
        {events.map((ev, i) => {
          const isLeft = ev.side === "left";
          const accent = accentColors[ev.accent];

          return (
            <div
              key={i}
              ref={(el) => (cardRefs.current[i] = el)}
              className="tl-event"
              style={{
                display: "flex",
                flexDirection: isLeft ? "row" : "row-reverse",
                alignItems: "flex-start",
                position: "relative",
                paddingBottom: "2.2rem",
                opacity: 0,
                transform: "translateY(16px)",
                transition: "opacity 0.55s ease, transform 0.55s ease",
              }}
            >
              {/* Spine dot */}
              <div style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                top: 18,
                width: 13, height: 13,
                borderRadius: "50%",
                border: `2px solid ${accent.dot}`,
                background: "var(--bg, #1a1a1a)",
                zIndex: 2,
              }} />

              {/* Connector */}
              <div style={{
                position: "absolute",
                top: 24,
                left: isLeft ? undefined : "calc(50% + 12px)",
                right: isLeft ? "calc(50% - 35px)" : undefined,
                [isLeft ? "left" : "right"]: isLeft ? "calc(50% + 12px)" : "calc(50% + 12px)",
                height: 1,
                background: "rgba(255,255,255,0.12)",
                width: "calc(50% - 48px)",
              }} />

              {/* Card */}
              <div style={{
                width: "calc(50% - 36px)",
                marginLeft: isLeft ? 0 : "auto",
                marginRight: isLeft ? "auto" : 0,
                background: "rgba(255,255,255,0.04)",
                border: "0.5px solid rgba(255,255,255,0.12)",
                borderRadius: 12,
                padding: "0.9rem 1rem 0.9rem 1.1rem",
                position: "relative",
                cursor: "pointer",
                transition: "border-color 0.2s, transform 0.2s",
              }}>
                {/* Accent stripe */}
                <div style={{
                  position: "absolute",
                  [isLeft ? "left" : "right"]: 0,
                  top: 10, bottom: 10,
                  width: 3,
                  borderRadius: isLeft ? "12px 0 0 12px" : "0 12px 12px 0",
                  background: accent.stripe,
                  opacity: 0.55,
                }} />

                <div style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.4, marginBottom: 4 }}>
                  {ev.label}
                </div>
                <div style={{ fontFamily: "Georgia, serif", fontSize: "0.95rem", fontWeight: 600, marginBottom: 5, lineHeight: 1.3 }}>
                  {ev.title}
                </div>
                <div style={{ fontSize: "0.78rem", opacity: 0.65, lineHeight: 1.65, fontWeight: 300 }}>
                  {ev.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* End heart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        style={{ textAlign: "center", paddingTop: "0.5rem" }}
      >
        <span style={{ fontSize: "1.3rem" }}>❤️</span>
        <p style={{ fontSize: "0.72rem", letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.35, marginTop: 6 }}>
          A story still being written
        </p>
      </motion.div>

      <style>{`
        .tl-event.tl-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </div>
  );
}