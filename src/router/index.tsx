import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const Home = React.lazy(() => import("src/views/home/index"));
const Voice = React.lazy(() => import("src/views/voice/index"));
const Photo = React.lazy(() => import("src/views/photo/index"));
const Video = React.lazy(() => import("src/views/video/index"));
const Screen = React.lazy(() => import("src/views/screen/index"));

export default function AppRouters() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/voice" element={<Voice />} />
        <Route path="/photo" element={<Photo />} />
        <Route path="/video" element={<Video />} />
        <Route path="/screen" element={<Screen />} />
      </Routes>
    </Suspense>
  );
}
