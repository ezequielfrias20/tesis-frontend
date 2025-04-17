import React, { useEffect, useRef } from "react";

interface IParams {
  stream: MediaStream;
}

const VideoPlayer = ({ stream }: IParams) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream;
  }, [stream]);

  return (
    <video
      autoPlay
      muted
      playsInline
      className="w-full h-full object-cover"
      ref={videoRef}
    />
  );
};

export default VideoPlayer;
