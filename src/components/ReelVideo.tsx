import React, { useRef, useState, useEffect } from "react";
import { FaPause, FaPlay, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { Button } from "./ui/button";

interface ReelVideoProps {
  src: string;
  isActive: boolean;
  isPlaying: boolean;
  isMuted: boolean;
}

const ReelVideo: React.FC<ReelVideoProps> = ({
  src,
  isActive,
  isPlaying,
  isMuted,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showIcon, setShowIcon] = useState(false);
  const [muted, setMuted] = useState(isMuted);
  const [isPlayingState, setIsPlayingState] = useState(isPlaying);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive && isPlayingState) {
        videoRef.current.play().catch((error) => {
          console.error("Video playback failed:", error);
        });
      } else {
        videoRef.current.pause();
      }
      videoRef.current.muted = muted;
    }
  }, [isActive, isPlayingState, muted]);

  const handleVideoClick = () => {
    setIsPlayingState((prev) => !prev);
    setShowIcon(true);
    setTimeout(() => setShowIcon(false), 1000);
  };

  const handleMuteToggle = () => {
    setMuted((prev) => !prev);
  };

  return (
    <div className="relative w-full h-screen flex justify-center items-center overflow-hidden p-4">

      <div className="absolute inset-0 bg-white bg-opacity-10 backdrop-blur-sm"></div>
      
      <video
        ref={videoRef}
        src={src}
        className="absolute w-auto h-full max-w-none object-cover rounded-2xl"
        loop
        onClick={handleVideoClick}
      />
      
      {showIcon && (
        <div
          className="absolute z-10 text-white text-4xl transition-opacity duration-300 opacity-100"
          style={{
            opacity: showIcon ? 1 : 0,
          }}
        >
          {isPlayingState ? <FaPause /> : <FaPlay />}
        </div>
      )}
      <Button
        className="absolute bottom-10 left-10 z-10"
        onClick={handleMuteToggle}
      >
        {muted ? <FaVolumeMute className="text-black" /> : <FaVolumeUp className="text-black" />}
      </Button>
    </div>
  );
};

export default ReelVideo;
