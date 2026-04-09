import { motion } from "framer-motion";

export default function Timeline() {

  const events = [
    { date: "The Beginning", text: "The day our story started ❤️" },
    { date: "Marriage", text: "The day you became my forever" },
    { date: "2022", text: "You traveled to Canada 🇨🇦" },
    { date: "Now", text: "Still loving you, still choosing you" },
  ];

  return (
    
    <motion.div 
    className="glass"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}>
      <h2>Our Journey 🕰️</h2>
      {events.map((e, i) => (
        <p key={i}><strong>{e.date}:</strong> {e.text}</p>
      ))}
    </motion.div>
  );
}