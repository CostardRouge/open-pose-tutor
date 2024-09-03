// Nextjs
"use client"

// React
import React, { useState, useEffect, useRef } from 'react';

// Third party
import axios from "axios";
import styled from "styled-components";

// Mediapipe
import { PoseLandmarker, FilesetResolver, DrawingUtils } from "./task-visions";

const VideoSkeletonContainer = styled.div`
    flex: 2;

    .video-skeleton-frames-container {
        display: flex;
        gap: 0.5rem;
        flex-direction: row;
        overflow-y: scroll;

        img, canvas {
            max-height: 250px;
            max-width: 150px;
        }
    }
`;

const PoseDetection = ({ imageUrl }) => {
    const imageRef = useRef(null);
    const canvasRef = useRef(null);
    const [landmarks, setLandmarks] = useState(null);
    const [poseLandmarker, setPoseLandmarker] = useState(null);

    useEffect( () => {
        const createLandmarker = async () => {
            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
            );
    
            setPoseLandmarker( await PoseLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
                    delegate: "GPU"
                },
                runningMode: "IMAGE",
                numPoses: 1
            }) );
        };

        createLandmarker();
    }, []);

    useEffect(() => {
        const canvas = canvasRef?.current;
        const image = imageRef?.current;

        if (!canvas && !image) {
            return
        }

        canvas.setAttribute("width", image.naturalWidth + "px");
        canvas.setAttribute("height", image.naturalHeight + "px");

        canvas.style =
            "left: 0px;" +
            "top: 0px;" +
            "width: " +
            image.width +
            "px;" +
            "height: " +
            image.height +
            "px;";

        canvas.getContext("2d").drawImage(image, 0, 0)
    }, [imageUrl]);

    useEffect(() => {
        if (poseLandmarker === null) {
            return;
        }

        const canvas = canvasRef?.current;
        const image = imageRef?.current;

        if (!canvas && !image) {
            return
        }

        poseLandmarker.detect(image, (result) => {
            const canvasCtx = canvas.getContext("2d");
            const drawingUtils = new DrawingUtils(canvasCtx);

            setLandmarks(result.landmarks)

            for (const landmark of result.landmarks) {
                drawingUtils.drawLandmarks(landmark, {
                    radius: (data) => DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1)
                });
                drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);
            }
        });
    }, [poseLandmarker, imageUrl]);

    return (
        <>
            <canvas ref={canvasRef} />
            <img ref={imageRef} src={imageUrl} hidden/>
        </>
    )
};

const VideoSkeleton = ({ frames }) => {
    return (
        <VideoSkeletonContainer>
            <h2>3. video-skeleton</h2>

            <div className="video-skeleton-frames-container">
                { frames?.map( frame => (
                    // <img src={frame} key={frame} />
                    <PoseDetection imageUrl={frame} key={frame} />
                ) ) }
            </div>

            <br />
            <button
                type="submit"
                disabled
            >
                submit
            </button>
        </VideoSkeletonContainer>
    );
};

export default VideoSkeleton;
