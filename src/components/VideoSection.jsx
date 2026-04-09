export default function VideoSection() {
  return (
    <div className="glass">
      <h2>Our Story 🎬</h2>
      <video
        controls
        style={{
          width: "100%",
          borderRadius: "15px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.7)"
        }}
          >
        <source src="/video/wifevid1.mp4" type="video/mp4" />
      </video>
    </div>
  );
}