export default function VoiceNote() {
  return (
    <div className="glass">
      <h2>Listen to Me 💬</h2>
      <audio controls>
        <source src="/voice.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}   