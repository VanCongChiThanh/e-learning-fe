// src/pages/Course/Learning/LearningVideo.tsx

import React, { useEffect, useRef, useCallback } from "react";
import YouTube, { YouTubePlayer } from "react-youtube";

// Định nghĩa kiểu cho một điểm kích hoạt sự kiện (không thay đổi)
export interface TimeTrigger {
  time: number;
  action: string;
  triggered: boolean;
  type?: string; // Thêm type để phân biệt QUIZ, NOTE...
}

// Định nghĩa kiểu cho state của progress
export interface ProgressState {
  played: number;
  playedSeconds: number;
  loaded: number;
  loadedSeconds: number;
}

interface LearningVideoProps {
  videoUrl?: string;
  triggers: TimeTrigger[];
  onTimeTrigger: (action: string, type?: string) => void;
  setTriggers: React.Dispatch<React.SetStateAction<TimeTrigger[]>>;
  onProgress?: (state: ProgressState) => void;
}

const LearningVideo: React.FC<LearningVideoProps> = ({ videoUrl, triggers, onTimeTrigger, setTriggers, onProgress }) => {
  const youtubePlayerRef = useRef<YouTubePlayer | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const resetTriggers = triggers.map(t => ({ ...t, triggered: false }));
    setTriggers(resetTriggers);
  }, [videoUrl]);

  const isYouTube = videoUrl ? videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be") : false;

  // --- LOGIC CHO TRÌNH PHÁT YOUTUBE ---
  useEffect(() => {
    if (!isYouTube) return;

    const interval = setInterval(() => {
      if (youtubePlayerRef.current && youtubePlayerRef.current.getPlayerState() === 1) {
        const currentTime = youtubePlayerRef.current.getCurrentTime();

        // Gọi onProgress nếu có
        if (onProgress) {
          onProgress({
            played: currentTime / (youtubePlayerRef.current.getDuration() || 1),
            playedSeconds: currentTime,
            loaded: 0, // YouTube API v3 không cung cấp thông tin này dễ dàng
            loadedSeconds: 0,
          });
        }
        
        // highlight-start
        // LOG THỜI GIAN HIỆN TẠI CỦA VIDEO YOUTUBE
        console.log(`YouTube Current Time: ${Math.floor(currentTime)}s`);
        // highlight-end

        triggers.forEach((trigger, index) => {
          if (!trigger.triggered && currentTime >= trigger.time) {
            // highlight-start
            // LOG KHI TRIGGER ĐƯỢC KÍCH HOẠT
            console.log(`%c TRIGGER ACTIVATED at ${currentTime}s for action: ${trigger.action} (trigger time was ${trigger.time}s)`, 'color: lightgreen; font-weight: bold;');
            // highlight-end
            youtubePlayerRef.current?.pauseVideo();
            onTimeTrigger(trigger.action, trigger.type);
            const newTriggers = [...triggers];
            newTriggers[index].triggered = true;
            setTriggers(newTriggers);
          }
        });
      }
    }, 1000); // Kiểm tra mỗi giây

    return () => clearInterval(interval);
  }, [isYouTube, triggers, onTimeTrigger, setTriggers, videoUrl, onProgress]);

  // --- LOGIC CHO TRÌNH PHÁT HTML <video> ---
  const handleTimeUpdate = useCallback(() => {
      if (!videoRef.current) return;
      // Gọi onProgress cho HTML5 video
      if (onProgress) {
        const { currentTime, duration } = videoRef.current;
        onProgress({ played: currentTime / duration, playedSeconds: currentTime, loaded: 0, loadedSeconds: 0 });
      }
      const currentTime = videoRef.current.currentTime;
  
      // highlight-start
      // LOG THỜI GIAN HIỆN TẠI CỦA VIDEO HTML5
      console.log(`HTML5 Video Current Time: ${Math.floor(currentTime)}s`);
      // highlight-end
      
      triggers.forEach((trigger, index) => {
        if (!trigger.triggered && currentTime >= trigger.time) {
          // highlight-start
          // LOG KHI TRIGGER ĐƯỢC KÍCH HOẠT
          videoRef.current?.pause();
          console.log(`%c TRIGGER ACTIVATED at ${currentTime}s for action: ${trigger.action} (trigger time was ${trigger.time}s)`, 'color: lightblue; font-weight: bold;');
          // highlight-end
          onTimeTrigger(trigger.action, trigger.type); 
          const newTriggers = [...triggers];
          newTriggers[index].triggered = true;
          setTriggers(newTriggers);
        }
      });
    },
    [onProgress, onTimeTrigger, setTriggers, triggers]
  );

  if (!videoUrl) {
    return (
      <div className="w-full aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center text-white">
        Chưa có video
      </div>
    );
  }

  const getYouTubeVideoId = (url: string): string | null => {
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get('v');
    } catch (e) {
      return null;
    }
  };

  return (
    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
      {isYouTube ? (
        <YouTube
          videoId={getYouTubeVideoId(videoUrl) || ''}
          className="w-full h-full"
          onReady={(event) => { youtubePlayerRef.current = event.target; }}
          opts={{
            height: '100%',
            width: '100%',
            playerVars: { autoplay: 1 },
          }}
        />
      ) : (
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          autoPlay
          className="w-full h-full object-cover"
          onTimeUpdate={handleTimeUpdate}
        />
      )}
    </div>
  );
};

export default LearningVideo;