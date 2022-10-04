# media-record

媒体 API 操作，纯粹的前端工程，不记录用户信息、不发送 HTTP Request。

## 录制声音

客户端使用`navigator.mediaDevices.getUserMedia`获取的音频的`stream`，再使用`MediaRecorder`记录声音，最终使用`<audio>`播放。

能力：

- 声音录制
- 音频文件下载

## 录制视频

客户端使用`navigator.mediaDevices.getUserMedia`获取的音频、视频的`stream`，再使用`MediaRecorder`记录声音，最终使用`<video>`播放。

能力：

- 声音录制
- 视频录制
- 视频文件下载
- 画中画
