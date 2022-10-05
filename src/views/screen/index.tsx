import { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";

function useAutoplay() {
  const videoRef = useRef(null);
  useEffect(() => {
    const video = videoRef.current as any;
    video.onloadedmetadata = video.play;
  }, []);

  return [videoRef];
}

let cacheStream: MediaStream | null;
function useCapture(videoRef: React.MutableRefObject<any>) {
  const change = () => {
    stop();

    navigator.mediaDevices
      .getDisplayMedia({
        audio: true,
        video: true,
      })
      .then((stream) => {
        cacheStream = stream;
        const video = videoRef.current as any;
        video.srcObject = stream;
      });
  };

  const stop = () => {
    if (!cacheStream) return;

    cacheStream.getTracks().forEach((track) => track.stop());
    cacheStream = null;
  };

  return [change, stop];
}

export default function Screen() {
  const [videoRef] = useAutoplay();
  const [change, stop] = useCapture(videoRef);

  return (
    <article className={styles.container}>
      <header>共享屏幕</header>

      <video ref={videoRef}></video>

      <footer>
        <button onClick={change}>选择共享窗口</button>
        <button onClick={stop}>停止共享</button>
      </footer>
    </article>
  );
}
