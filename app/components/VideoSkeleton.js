// Nextjs
"use client"

// React
import React, { useState, useEffect, useRef } from 'react';

// Third party
import axios from "axios";
import styled from "styled-components";

import * as tf from '@tensorflow/tfjs';
import * as blazepose from '@tensorflow-models/blazepose';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { POSE_CONNECTIONS } from '@mediapipe/pose';

const VideoSkeletonContainer = styled.div`
    flex: 2;

    .video-skeleton-frames-container {
        display: flex;
        gap: 0.5rem;
        flex-direction: row;
        overflow-y: scroll;

        img {
            max-height: 250px;
        }
    }
`;

const PoseDetection = ({ imageUrl }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const loadAndProcessImage = async () => {
            const net = await blazepose.load();

            const img = new Image();
            img.src = imageUrl;
            img.onload = async () => {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.height);

                const predictions = await net.estimatePoses(img);

                predictions.forEach((pose) => {
                drawPose(pose, ctx);
                });
            };
        };

        if (imageUrl) {
            loadAndProcessImage();
        }
    }, [imageUrl]);

    const drawPose = (pose, ctx) => {
        const keypoints = pose.keypoints;

        drawConnectors(ctx, keypoints, POSE_CONNECTIONS, { color: 'white', lineWidth: 4 });
        drawLandmarks(ctx, keypoints, { color: 'red', lineWidth: 2 });
    };

    return <canvas ref={canvasRef} />;
};

const VideoSkeleton = ({ frames }) => {
    return (
        <VideoSkeletonContainer>
            <h2>3. video-skeleton</h2>

            <div className="video-skeleton-frames-container">
                { frames?.map( frame => (
                    <img src={frame} key={frame} />
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
