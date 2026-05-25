import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { SplashScreen } from "@capacitor/splash-screen";
import Lottie from "lottie-react";
import splashAnimation from "@/assets/splash-animation.json";

const VideoSplash = () => {
  const navigate = useNavigate();

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
    if (Capacitor.isNativePlatform()) {
      SplashScreen.hide({ fadeOutDuration: 0 });
    }
    const timer = setTimeout(goNext, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      onClick={goNext}
      style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Lottie
        animationData={splashAnimation}
        loop={true}
        autoplay={true}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default VideoSplash;
