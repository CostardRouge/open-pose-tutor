// Nextjs
"use client"

// React
import React, { useState } from 'react';

import styles from "./page.module.css";

// components
import VideoUpload from "./components/VideoUpload";
import VideoSkeleton from "./components/VideoSkeleton";

export default function Home() {
  const [frames, setFrames] = useState([
    // "./uploads/HaniaRani/frames/001.png",
    // "./uploads/test.png"
  ]);

  return (
    <main className={styles.main}>
      <h1>open-pose-tutor (skeleton-to-text)</h1>

      <VideoUpload onFramesReceived={setFrames} />

      <br />
      <VideoSkeleton frames={frames}/>
      
    </main>
  );
}
