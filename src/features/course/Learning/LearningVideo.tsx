import React from "react";

interface LearningVideoProps {
  videoUrl?: string;
}

const LearningVideo: React.FC<LearningVideoProps> = ({ videoUrl }) => {
  if (!videoUrl) {
    return (
      <div className="w-full aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center text-white">
        Chưa có video
      </div>
    );
  }

  return (
    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
      <video
        src={videoUrl}
        controls
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default LearningVideo;
