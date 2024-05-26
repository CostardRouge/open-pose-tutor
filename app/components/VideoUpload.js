// Nextjs
"use client"

// React
import React, { useState } from 'react';

// Third party
import axios from "axios";
import styled from "styled-components";

const VideoUploadContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: left;

    & > div+div {
        padding-left: 0.5rem;
    }

    .video-upload-frames {
        flex: 2;
        overflow: hidden;

        .video-upload-frames-container {
            display: flex;
            gap: 0.5rem;
            flex-direction: row;
            overflow-y: scroll;

            img {
                max-height: 250px;
            }
        }
    }
`;

const VideoUpload = ({ onFramesReceived }) => {
    const [loading, setLoading] = useState(null);
    const [video, setVideo] = useState(null);
    const [frames, setFrames] = useState(null);
    const [url, setUrl] = useState(null);

    const handleFileChange = (event) => {
        const [ file ] = event.target.files;

        setVideo(file);
        setUrl(URL.createObjectURL(file));
    };

    const handleUpload = () => {
        if (!video) {
            return;
        }

        const formData = new FormData();
        
        formData.append("video", video);

        setLoading(true)

        axios
            .post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then( ({data: frames }) => {
                setFrames(frames);
                onFramesReceived(frames)
            } )
            .catch( console.error )
            .finally( () => setLoading(false) )
    };

    return (
        <VideoUploadContainer>
            <div className="video-upload-form">
            <h2>1. video-upload</h2>
                <input type="file" accept="video/*" onChange={handleFileChange} />
                <br />
                <video src={url} controls width="150" height="250" />
                <br />
                <button
                    type="submit"
                    disabled={null === url}
                    onClick={handleUpload}
                >
                    submit
                </button>
            </div>

            <div className="video-upload-frames">
                <h2>2. video-frames</h2>
                { true === loading && "loading..." }
                <br />
                <div className="video-upload-frames-container">
                    { false === loading && (
                        frames?.map( frame => (
                            <img src={frame} key={frame} />
                        ) )
                    ) }
                </div>
            </div>
        </VideoUploadContainer>
    );
};

export default VideoUpload;
