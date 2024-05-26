// Nextjs
import { NextResponse } from 'next/server'

// Node
import { revalidatePath } from "next/cache";
import fs from "node:fs/promises";
import path from 'path';

import { createCanvas, loadImage } from 'canvas';
import tf from '@tensorflow/tfjs-node';
import { Pose } from '@mediapipe/pose';

export async function GET(request, context) {
    const imagePath = "uploads/HaniaRani/frames/001.png" //context?.params?.["image-path"];
    const imageFileContent = await fs.readFile(`./public/${imagePath}`);

    const fileExtension = path.extname(imagePath).substring(1)



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
