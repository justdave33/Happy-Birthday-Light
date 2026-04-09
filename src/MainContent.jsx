import Slider from "./components/Slider";
import Timeline from "./components/Timeline";
import VoiceNote from "./components/VoiceNote";
import Surprise from "./components/Surprise";
import LoveLetter from "./components/LoveLetter";
import Countdown from "./components/CountDown";
import VideoSection from "./components/VideoSection";
import config from "./config";

export default function MainContent() {
  return (
    <div>
      <h1> Happy Birthday, {config.herName} ❤️</h1>

      <audio autoPlay loop>
        <source src="/music.mp3" type="audio/mpeg" />
      </audio>

      <Slider />
      <VideoSection />
      <Timeline />
      <Countdown />
      <VoiceNote />
      <Surprise />
      <LoveLetter />
    </div>
  );
}