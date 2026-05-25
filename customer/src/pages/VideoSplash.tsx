import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { SplashScreen } from "@capacitor/splash-screen";
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

    const onReady = async () => {
      // Hide native splash and play video at exactly the same moment
      if (Capacitor.isNativePlatform()) {
        await SplashScreen.hide({ fadeOutDuration: 0 });
      }
      video.play().catch(() => goNext());
    };

    video.addEventListener("canplay", onReady);
    video.addEventListener("ended", goNext);
    video.addEventListener("error", goNext);

    // Fallback: if video doesn't load in 4s, hide splash and go next
    const timeout = setTimeout(async () => {
      if (Capacitor.isNativePlatform()) {
        await SplashScreen.hide({ fadeOutDuration: 0 });
      }
      goNext();
    }, 4000);

    return () => {
      video.removeEventListener("canplay", onReady);
      video.removeEventListener("ended", goNext);
      video.removeEventListener("error", goNext);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div onClick={goNext} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#000" }}>
      <style>{`
        video::-webkit-media-controls,
        video::-webkit-media-controls-enclosure,
        video::-webkit-media-controls-panel,
        video::-webkit-media-controls-play-button,
        video::-webkit-media-controls-start-playback-button,
        video::-webkit-media-controls-overlay-play-button { display:none!important; opacity:0!important; }
      `}</style>
      <video
        ref={videoRef}
        src={splashVideo}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", pointerEvents:"none" }}
      />
    </div>
  );
};

export default VideoSplash;
