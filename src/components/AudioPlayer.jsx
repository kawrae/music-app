import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2 } from "lucide-react";

function formatTime(time) {
  if (!Number.isFinite(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function AudioPlayer({ src }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    function handleLoadedMetadata() {
      setDuration(audio.duration || 0);
    }

    function handleTimeUpdate() {
      setCurrentTime(audio.currentTime || 0);
    }

    function handleEnded() {
      setIsPlaying(false);
    }

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [src]);

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      await audio.play();
      setIsPlaying(true);
    }
  }

  function handleSeek(event) {
    const audio = audioRef.current;
    if (!audio) return;

    const nextTime = Number(event.target.value);
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-3">
      <audio ref={audioRef} src={src} preload="metadata" />

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={togglePlayback}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
        </button>

        <div className="min-w-0 flex-1">
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="w-full accent-white"
          />

          <div className="mt-1 flex items-center justify-between text-xs text-zinc-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="hidden sm:flex h-10 w-10 items-center justify-center text-zinc-500">
          <Volume2 size={16} />
        </div>
      </div>
    </div>
  );
}

export default AudioPlayer;