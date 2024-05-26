// Nextjs
import { NextResponse } from 'next/server'

// Third party
import ffmpeg from "fluent-ffmpeg";

// Node
import { revalidatePath } from "next/cache";
import fs from "node:fs/promises";

export async function POST(request, context) {
    const formData = await request.formData();
    const file = formData.get("video");
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const { name, type, size, lastModified } = file;
    const [fileName, fileExtension] = name.split(".");
    const uploadDirectoryPath = `./public/uploads/${fileName}`;
    const framesDirectoryPath = `${uploadDirectoryPath}/frames`;
    const uploadedVideoPath = `${uploadDirectoryPath}/video.${fileExtension}`;

    await fs.mkdir(uploadDirectoryPath, { recursive: true });
    await fs.mkdir(framesDirectoryPath, { recursive: true });
    await fs.writeFile(uploadedVideoPath, buffer);

    const frames = await new Promise( (resolve, reject) => {
        ffmpeg(uploadedVideoPath)
            .on('end', async () => {
                const frames = await fs
                    .readdir(framesDirectoryPath)
                    .then( filenames => filenames.map( file => `/uploads/${fileName}/frames/${file}`) );

                revalidatePath("/");
                resolve(frames);
            })
            .on('error', reject )
            .screenshots({
                folder: framesDirectoryPath,
                filename: '%00i.png',
                count: 10
            })
    });

    return NextResponse.json( frames );

    return NextResponse.json({
        error
    }, {
        status: 500
    });
}
