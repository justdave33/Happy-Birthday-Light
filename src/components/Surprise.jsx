import { useState } from "react";
import { motion } from "framer-motion";

export default function Surprise() {
  const [open, setOpen] = useState(false);

  return (
    <motion.div className="glass"
     onClick={() => setOpen(true)}
     initial={{ opacity: 0, y: 50 }}
     whileInView={{ opacity: 1, y: 0 }}
     transition={{ duration: 1 }}>
        {!open ? (
          <h2 className="glow">Tap to Reveal 🎁</h2>
        ) : (
          <p style={{ animation: "fadeIn 1s ease-in-out" }}>
            I’m coming back to you soon… and I still choose us ❤️
          </p>
        )}
    </motion.div>
);
}