import { MutableRefObject, useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";

function streamRecorder(mediaRecorder: MediaRecorder): Promise<Blob[]> {
  return new Promise((resolve, reject) => {
    let chunks: Blob[] = [];
    mediaRecorder.onstart = function (e) {
      chunks = [];
    };
    mediaRecorder.ondataavailable = function (e) {
      chunks.push(e.data);
    };
    mediaRecorder.onstop = function (e) {
      resolve(chunks);
    };
    mediaRecorder.start();
  });
}

function useRecorder(
  videoRef: MutableRefObject<any>
): [Blob[], () => void, () => void] {
  const [chunks, setChunks] = useState<Blob[]>([]);
  let cacheStream: MediaStream, recorder: MediaRecorder;

  const start = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        cacheStream = stream;

        // 新建一个recorder
        recorder = new MediaRecorder(stream);

        // 实时记录音频、视频
        const preview = videoRef.current;
        preview.srcObject = stream;
        return new Promise((resolve) => (preview.onplaying = resolve));
      })
      .then(() => {
        // 启动记录
        return streamRecorder(recorder);
      })
      .then((chunks) => {
        console.log(chunks);
        setChunks(chunks);
      });
  };

  const stop = () => {
    // 关闭音频、视频流
    if (!!cacheStream) {
      cacheStream.getTracks().forEach((track) => track.stop());
    }
    // 关闭recorder
    if (!!recorder) {
      recorder.stop();
    }
  };

  return [chunks, start, stop];
}

/**
 * video自动播放
 *
 * @returns
 */
function useAutoplay() {
  const vRef = useRef(null);

  useEffect(() => {
    const video = vRef.current as any;
    video.onloadedmetadata = video.play;
  }, []);

  return [vRef];
}

type RecorderProps = { upload: (chunks: Blob[]) => void };

/**
 * 录制视频
 *
 * @param props
 * @returns
 */
function Recorder(props: RecorderProps) {
  const [vRef] = useAutoplay();

  const [chunks, start, stop] = useRecorder(vRef);

  useEffect(() => {
    if (chunks.length === 0) return;

    props.upload(chunks);
  }, [chunks, props]);

  return (
    <article className={styles["block-layout"]}>
      <header>录制视频</header>
      <main>
        <video ref={vRef} src="" muted></video>
      </main>

      <footer>
        <button onClick={start}>开始录制</button>
        <button onClick={stop}>停止录制</button>
      </footer>
    </article>
  );
}

/**
 * 画中画
 *
 * @param elRef
 */
function togglePictureInPicture(elRef: MutableRefObject<null>) {
  if (document.pictureInPictureElement) {
    document.exitPictureInPicture();
  } else {
    if (document.pictureInPictureEnabled) {
      const ref = elRef.current as any;
      ref.requestPictureInPicture();
    }
  }
}

type PlayerProps = { chunks: Blob[] };

/**
 * 播放已录制的视频
 *
 * @param props
 * @returns
 */
function Player(props: PlayerProps) {
  const [vRef] = useAutoplay();

  const [ready, setReady] = useState(false);
  const [url, setUrl] = useState<string>("");

  const [info, setInfo] = useState({ size: 0, type: "" });
  useEffect(() => {
    const flag = props.chunks.length !== 0;
    setReady(flag);

    if (flag === false) return;

    let blob = new Blob(props.chunks, {
      type: "video/webm",
    });
    setUrl(URL.createObjectURL(blob));

    setInfo({
      size: blob.size,
      type: blob.type,
    });
  }, [props]);

  const footerEls = () => {
    if (ready)
      return (
        <footer>
          <button onClick={() => togglePictureInPicture(vRef)}>画中画</button>
          <button>
            <a href={url} download="video.webm">
              下载
            </a>
          </button>

          <p>
            the video file {info.size} bytes of {info.type} media
          </p>
        </footer>
      );

    return null;
  };

  return (
    <article className={styles["block-layout"]}>
      <header>播放视频</header>

      <main>
        <video ref={vRef} src={url} controls={ready}></video>
      </main>

      {footerEls()}
    </article>
  );
}

export default function Video() {
  const [data, setData] = useState<Blob[]>([]);
  const setChunks = (chunks: Blob[]) => {
    setData(chunks);
  };

  return (
    <article className={styles.container}>
      <Recorder upload={setChunks} />

      <Player chunks={data} />
    </article>
  );
}
