import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import { Button } from "@nextui-org/react";

// Helper function to handle full-screen requests
const requestFullScreen = (element) => {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
};

// Helper function to handle exiting full-screen
const exitFullScreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
};

const GameEmbed = () => {
  const { src, title } = useParams();
  const navigate = useNavigate();

  const decodedSrc = decodeURIComponent(src);
  const decodedTitle = decodeURIComponent(title);

  const iframeRef = useRef(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20); // 4 hours in seconds

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          window.alert("Your gaming session for the day has ended !"); // Alert box
          navigate("/mylibrary"); // Navigate to /mylibrary after alert is closed
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Clean up the timer on component unmount
  }, [navigate]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      const fullscreenElement =
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement;
      setIsFullScreen(!!fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullScreenChange);
    document.addEventListener("mozfullscreenchange", handleFullScreenChange);
    document.addEventListener("MSFullscreenChange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullScreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullScreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullScreenChange);
    };
  }, []);

  const handleFullScreenToggle = () => {
    if (isFullScreen) {
      exitFullScreen();
    } else {
      requestFullScreen(iframeRef.current);
    }
  };

  const handleCut = () => {
    navigate("/mylibrary");
  };

  // Format time left in HH:MM:SS
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <Header />
      <div className="relative bg-customDark min-h-screen p-4">
        <h1 className="text-5xl text-white mb-4 text-left">{decodedTitle}</h1>
        <div className="relative">
          <iframe
            ref={iframeRef}
            src={decodedSrc}
            title={decodedTitle}
            width="100%"
            height="600"
            frameBorder="0"
            allowFullScreen
            className="block"
          ></iframe>

          <div className="flex flex-col">
            {/* Full Screen Button */}
            <Button
              onClick={handleFullScreenToggle}
              className="absolute top-4 right-4 z-10 font-primaryRegular ml-4"
              radius="none"
              color="primary"
              style={{ padding: "10px", position: "absolute" }}
            >
              {isFullScreen ? "Exit Full Screen" : "Full Screen"}
            </Button>

            {/* Exit Game Button */}
            <Button
              onClick={handleCut}
              className="absolute top-4 right-24 z-10 font-primaryRegular"
              variant="ghost"
              color="primary"
              radius="none"
              style={{
                padding: "10px",
                position: "absolute",
              }}
            >
              EXIT GAME
            </Button>
          </div>
        </div>
        {/* Timer Display */}
        <div className="absolute bottom-4 left-4 text-black text-xl">
          Time Left: {formatTime(timeLeft)}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default GameEmbed;