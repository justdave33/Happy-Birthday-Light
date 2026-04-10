import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Surprise() {
  const [open, setOpen] = useState(false);
  const audioRef = useRef(null);

  // Free love song from an open/public CDN source
  // Using a royalty-free romantic piano piece from pixabay CDN
  const loveSongUrl =
    "https://cdn.pixabay.com/download/audio/2022/03/15/audio_1e842ceb08.mp3";

  useEffect(() => {
    if (open && audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(() => {
        // Autoplay blocked — audio controls will let her play manually
      });
    }
    if (!open && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [open]);

  return (
    <motion.div
      className="glass"
      onClick={() => !open && setOpen(true)}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      style={{ cursor: open ? "default" : "pointer", overflow: "hidden" }}
    >
      <AnimatePresence mode="wait">
        {!open ? (
          <motion.div
            key="hint"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4 }}
            style={{ textAlign: "center", padding: "1rem 0" }}
          >
            <h2 className="glow" style={{ fontSize: "1.6rem" }}>
              Tap to Reveal 🎁
            </h2>
            <p style={{ opacity: 0.6, fontSize: "0.85rem", marginTop: "0.5rem" }}>
              A little glimpse into our future ✨
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Hidden audio element */}
            <audio ref={audioRef} loop>
              <source src={loveSongUrl} type="audio/mpeg" />
            </audio>

            {/* Caption */}
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              style={{
                textAlign: "center",
                fontSize: "1rem",
                marginBottom: "1rem",
                fontStyle: "italic",
                opacity: 0.9,
              }}
            >
              Us, in Canada… 5 years from now 🍁❤️
            </motion.p>

            {/* Futuristic image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 8px 40px rgba(255, 100, 100, 0.25)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <img
                src="/images/future-canada.jpg"
                alt="Our future in Canada"
                style={{
                  width: "100%",
                  display: "block",
                  borderRadius: "16px",
                }}
              />
            </motion.div>

            {/* Love message */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              style={{
                textAlign: "center",
                marginTop: "1.2rem",
                fontSize: "1rem",
                lineHeight: "1.7",
              }}
            >
              I'm coming back to you soon…{" "}
              <span style={{ color: "#ff6b6b" }}>and I still choose us ❤️</span>
            </motion.p>

            {/* Audio controls fallback */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              style={{ marginTop: "1rem", textAlign: "center" }}
            >
              <audio
                controls
                loop
                style={{ width: "100%", opacity: 0.7 }}
              >
                <source src={loveSongUrl} type="audio/mpeg" />
              </audio>
              <p style={{ fontSize: "0.7rem", opacity: 0.5, marginTop: "0.3rem" }}>
                🎵 If music didn't start, press play above
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}