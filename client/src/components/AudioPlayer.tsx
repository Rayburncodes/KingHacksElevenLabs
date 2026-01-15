import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, RotateCcw, Loader2 } from 'lucide-react';

interface AudioPlayerProps {
  textToSpeak: string;
  language?: string;
  autoPlay?: boolean;
}

export function AudioPlayer({ textToSpeak, language = 'english', autoPlay = true }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!textToSpeak) return;

    const fetchAudio = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: textToSpeak, language }),
        });

        if (!response.ok) throw new Error('Failed to fetch audio');

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        if (autoPlay) {
          const audio = new Audio(url);
          audioRef.current = audio;
          audio.onplay = () => setIsPlaying(true);
          audio.onended = () => setIsPlaying(false);
          audio.play().catch(e => console.error("Autoplay failed:", e));
        }
      } catch (error) {
        console.error("TTS error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAudio();

    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [textToSpeak, autoPlay]);

  const handlePlayPause = () => {
    if (!audioRef.current && audioUrl) {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
      audio.play();
      return;
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleReplay = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10 w-full sm:w-auto">
      <div className="p-2 bg-primary/10 rounded-full text-primary">
        {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Volume2 size={20} />}
      </div>
      
      <div className="flex-1">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
          Audio Explanation
        </p>
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePlayPause}
            disabled={isLoading || !audioUrl}
            className="text-sm font-semibold hover:text-primary transition-colors flex items-center gap-1 disabled:opacity-50"
          >
            {isPlaying ? (
              <><Pause size={14} /> Pause</>
            ) : (
              <><Play size={14} /> Play</>
            )}
          </button>
          
          <span className="text-border">|</span>
          
          <button 
            onClick={handleReplay}
            disabled={isLoading || !audioUrl}
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 disabled:opacity-50"
          >
            <RotateCcw size={14} /> Replay
          </button>
        </div>
      </div>
      
      {isPlaying && (
        <div className="flex gap-1 h-4 items-end">
          <div className="w-1 bg-primary/60 animate-[pulse_1s_ease-in-out_infinite] h-2"></div>
          <div className="w-1 bg-primary/60 animate-[pulse_1.5s_ease-in-out_infinite_0.1s] h-3"></div>
          <div className="w-1 bg-primary/60 animate-[pulse_1.2s_ease-in-out_infinite_0.2s] h-4"></div>
          <div className="w-1 bg-primary/60 animate-[pulse_1.3s_ease-in-out_infinite_0.3s] h-2"></div>
        </div>
      )}
    </div>
  );
}
