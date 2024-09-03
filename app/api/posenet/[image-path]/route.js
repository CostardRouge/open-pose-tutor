// Nextjs
import { NextResponse, NextRequest } from 'next/server'

// Node
import { revalidatePath } from "next/cache";
import fs from "node:fs/promises";
import path from 'path';

const { createCanvas, loadImage } = require('canvas');

// Mediapipe
import { PoseLandmarker, FilesetResolver, DrawingUtils } from "./task-visions";

let landmarker = null;

const createLandmarker = async () => {
    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
    );

    landmarker =  await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
            delegate: "GPU"
        },
        runningMode: "IMAGE",
        numPoses: 1
    });
};

createLandmarker();

export async function GET(request, context) {
    const imagePath = "uploads/HaniaRani/frames/001.png" //context?.params?.["image-path"];

    const img = await loadImage("./public/uploads/HaniaRani/frames/001.png");
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(img, 0, 0);

    const imageFileContent = await fs.readFile(`./public/${imagePath}`);

    // processImage("./public/uploads/HaniaRani/frames/001.png", "./public/uploads/HaniaRani/frames/001-p.png")

    const fileExtension = path.extname(imagePath).substring(1)

    const stream = canvas.createPNGStream();
    // stream.pipe(out);

    return new NextResponse( imageFileContent );




    // res.setHeader('Content-Type', `image/${ext}`)
    // res.send(image)

    return NextResponse.json( fileExtension );

    // const formData = await request.formData();
    // const file = formData.get("video");
    // const arrayBuffer = await file.arrayBuffer();
    // const buffer = new Uint8Array(arrayBuffer);
    // const { name, type, size, lastModified } = file;
    // const [fileName, fileExtension] = name.split(".");
    // const uploadDirectoryPath = `./public/uploads/${fileName}`;
    // const framesDirectoryPath = `${uploadDirectoryPath}/frames`;
    // const uploadedVideoPath = `${uploadDirectoryPath}/video.${fileExtension}`;

    // await fs.mkdir(uploadDirectoryPath, { recursive: true });
    // await fs.mkdir(framesDirectoryPath, { recursive: true });
    // await fs.writeFile(uploadedVideoPath, buffer);

    // const frames = await new Promise( (resolve, reject) => {
    //     ffmpeg(uploadedVideoPath)
    //         .on('end', async () => {
    //             const frames = await fs
    //                 .readdir(framesDirectoryPath)
    //                 .then( filenames => filenames.map( file => `/uploads/${fileName}/frames/${file}`) );

    //             revalidatePath("/");
    //             resolve(frames);
    //         })
    //         .on('error', reject )
    //         .screenshots({
    //             folder: framesDirectoryPath,
    //             filename: '%00i.png',
    //             count: 10
    //         })
    // });

    // return NextResponse.json( frames );

    // return NextResponse.json({
    //     error
    // }, {
    //     status: 500
    // });
}
