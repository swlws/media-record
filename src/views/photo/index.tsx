import { useEffect, useRef } from "react";
import styles from "./index.module.scss";

function useDom() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current as any;
    video.onloadedmetadata = video.play;

    const canvas = canvasRef.current as any;
    const context = canvas.getContext("2d");
    context.fillStyle = "#333";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  return [videoRef, canvasRef, imgRef];
}

let cacheStream: MediaStream | null;

type DomRef = React.MutableRefObject<any>;
function useCapture(videoRef: DomRef, canvasRef: DomRef, imgRef: DomRef) {
  const open = () => {
    if (!!cacheStream) return;

    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      const video = videoRef.current as any;
      video.srcObject = stream;

      cacheStream = stream;
    });
  };

  const close = () => {
    if (!cacheStream) return;

    cacheStream.getTracks().forEach((track) => track.stop());
    cacheStream = null;
  };

  const take = () => {
    const video = videoRef.current as any;
    const canvas = canvasRef.current as any;
    const img = imgRef.current as any;

    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const data = canvas.toDataURL("image/png");
    img.setAttribute("src", data);
  };
  const down = () => {};

  return [open, close, take, down];
}

export default function Photo() {
  const [videoRef, canvasRef, imgRef] = useDom();

  const [open, close, take] = useCapture(videoRef, canvasRef, imgRef);

  return (
    <article className={styles.container}>
      <header>
        <video ref={videoRef}></video>

        <br />
        <button onClick={open}>打开摄像头</button>
        <button onClick={take}>拍照</button>
        <button onClick={close}>关闭摄像头</button>
      </header>

      <main>
        <canvas ref={canvasRef}></canvas>
        <p>canvas</p>

        <img alt="" ref={imgRef} />
        <p>img</p>
      </main>
    </article>
  );
}
