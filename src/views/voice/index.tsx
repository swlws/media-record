import { useEffect, useState } from "react";
import styles from "./index.module.scss";

type ButtonProps = {
  status: boolean;
  onClick: () => void;
};

function Button(props: ButtonProps) {
  return (
    <div className={styles.button} onClick={props.onClick}>
      <p>{props.status ? "开始" : "停止"}</p>
    </div>
  );
}

let recorder: MediaRecorder;
function useRecorder(): [Blob[], () => void, () => void] {
  const [records, setRecords] = useState<Blob[]>([]);

  let chunks: Blob[] = [];

  const startRecorder = () => {
    if (!recorder) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        recorder = mediaRecorder;
        mediaRecorder.onstart = function (e) {
          chunks = [];
        };
        mediaRecorder.ondataavailable = function (e) {
          chunks.push(e.data);
        };
        mediaRecorder.onstop = function (e) {
          setRecords(chunks);
        };

        mediaRecorder.start();
      });
    } else {
      recorder.start();
    }
  };

  const stopRecorder = () => {
    if (!recorder) return;
    recorder.stop();
  };

  return [records, startRecorder, stopRecorder];
}

function useStatus(): [boolean, string[], () => void] {
  const [status, sv] = useState(true);
  const [records, startRecorder, stopRecorder] = useRecorder();
  const [voices, setVoices] = useState<string[]>([]);

  useEffect(() => {
    if (records.length === 0) return;

    var blob = new Blob(records, { type: "audio/ogg; codecs=opus" });
    var audioURL = window.URL.createObjectURL(blob);

    setVoices((arr) => {
      return [...arr, audioURL];
    });
  }, [records]);

  const toggle = () => {
    if (!checkEnv()) return;

    if (status === true) {
      startRecorder();
    } else {
      stopRecorder();
    }

    sv(!status);
  };
  return [status, voices, toggle];
}

function checkEnv() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("设备不支持录音，推荐使用Chrome浏览器。");
    return false;
  }
  return true;
}

export default function Voice() {
  const [status, voices, toggle] = useStatus();

  return (
    <article className={styles.container}>
      <main>
        <Button onClick={toggle} status={status} />
      </main>
      <footer>
        {voices.map((v, i) => (
          <audio key={i} controls src={v}></audio>
        ))}
      </footer>
    </article>
  );
}
