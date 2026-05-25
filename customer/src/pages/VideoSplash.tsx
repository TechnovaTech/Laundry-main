import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import splashVideo from "@/assets/splash.mp4";

const VideoSplash = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  const goNext = () => {
    const customerId = localStorage.getItem("customerId");
    const authToken = localStorage.getItem("authToken");
    if (customerId && authToken) {
      navigate("/home", { replace: true });
    } else {
      navigate("/welcome", { replace: true });
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => goNext());

    video.addEventListener("ended", goNext);
    video.addEventListener("error", goNext);

    // Fallback — max 10 seconds
    const timeout = setTimeout(goNext, 10000);

    return () => {
      video.removeEventListener("ended", goNext);
      video.removeEventListener("error", goNext);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={goNext}
    >
      <video
        ref={videoRef}
        src={splashVideo}
        autoPlay
        muted
        playsInline
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
};

export default VideoSplash;
