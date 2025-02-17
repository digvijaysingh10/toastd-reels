"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ReelVideo from "@/components/ReelVideo";
import CommentSection from "@/components/CommentSection";
import { Button } from "@/components/ui/button";
import { FaHeart, FaComment, FaShare } from "react-icons/fa";
import { debounce } from "lodash";

const videos = [
  { id: "video1", src: "/video1.mp4" },
  { id: "video2", src: "/video2.mp4" },
];

const Home: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [videoStates, setVideoStates] = useState(
    videos.map(() => ({
      likes: 0,
      comments: [] as string[],
      isLiked: false,
      isMuted: true,
      isPlaying: true,
    }))
  );
  const [isCommentVisible, setIsCommentVisible] = useState(false);
  const [isShareVisible, setIsShareVisible] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const handleScroll = useCallback(
    debounce(() => {
      if (containerRef.current) {
        const index = Math.round(containerRef.current.scrollTop / window.innerHeight);
        setActiveIndex(index);
        router.push(`?video=${videos[index].id}`);
      }
    }, 200),
    [router]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  const handleAddComment = useCallback((newComment: string) => {
    setVideoStates((prevStates) =>
      prevStates.map((state, index) =>
        index === activeIndex
          ? { ...state, comments: [...state.comments, newComment] }
          : state
      )
    );
  }, [activeIndex]);

  const toggleVisibility = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter((prevState) => !prevState);
  };

  const shareToWhatsApp = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://wa.me/?text=${url}`, '_blank');
  };

  const shareToFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const copyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };

  const downloadVideo = () => {
    const videoUrl = videos[activeIndex].src;
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = videoUrl.split("/").pop() || "video.mp4";
    link.click();
  };

  return (
    <div ref={containerRef} className="snap-y snap-mandatory h-screen w-full overflow-y-scroll">
      {videos.map((video, index) => (
        <div key={video.id} className="snap-center h-screen w-full relative">
          <ReelVideo
            src={video.src}
            isActive={index === activeIndex}
            isMuted={videoStates[activeIndex].isMuted}
            isPlaying={videoStates[activeIndex].isPlaying}
          />
          <div className="absolute bottom-5 right-5 flex flex-col gap-4 text-white text-xl">
            <Button
              onClick={() => {
                setVideoStates((prevStates) => {
                  const updatedState = [...prevStates];
                  updatedState[activeIndex].isLiked = !updatedState[activeIndex].isLiked;
                  updatedState[activeIndex].likes += updatedState[activeIndex].isLiked ? 1 : -1;
                  return updatedState;
                });
              }}
              aria-label="Like video"
              className={`transition-transform ${videoStates[activeIndex].isLiked ? 'text-red-500 scale-110' : 'text-neutral-400'}`}
            >
              <FaHeart /> {videoStates[activeIndex].likes}
            </Button>
            <Button onClick={() => toggleVisibility(setIsCommentVisible)}>
              <FaComment />
            </Button>
            <Button onClick={() => toggleVisibility(setIsShareVisible)}>
              <FaShare />
            </Button>
          </div>

          {isShareVisible && (
            <div className="absolute bottom-16 right-0 bg-white text-black p-4 rounded-lg shadow-lg flex flex-col gap-2">
              <Button onClick={shareToWhatsApp}>Share to WhatsApp</Button>
              <Button onClick={shareToFacebook}>Share to Facebook</Button>
              <Button onClick={copyLink}>Copy Link</Button>
              <Button onClick={downloadVideo}>Download Video</Button>
              <Button onClick={() => toggleVisibility(setIsShareVisible)}>Cancel</Button>
            </div>
          )}

          <CommentSection
            comments={videoStates[activeIndex].comments}
            onAddComment={handleAddComment}
            isVisible={isCommentVisible}
            onClose={() => toggleVisibility(setIsCommentVisible)}
          />
        </div>
      ))}
    </div>
  );
};

export default Home;
