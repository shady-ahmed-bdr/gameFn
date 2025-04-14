import sharp from "sharp";
import fs from "fs";
import path from "path";

// Get paths from environment
const HOST_PATH = process.env['IMG_FOLDER'] || './';
const DIST_PATH = process.env['DIST_FOLDER'] || './';
const IMG_NAME = process.env['IMG_FILE'];

export const imageToCpp = async (imageName?: string): Promise<void> => {
    if (!imageName) {
        throw new Error('No image was selected.');
    }
    const imagePath = path.resolve(HOST_PATH, imageName);
    const image = await sharp(imagePath).raw().toBuffer({ resolveWithObject: true });
    const { data, info } = image;
    const { width, height, channels } = info;
    // Format pixel data into a C++ array
    let cppArray = '';
    for (let i = 0; i < data.length; i++) {
        cppArray += `${data[i]}, `;
        if ((i + 1) % (channels * width) === 0) cppArray += '\n';
    }
    const cppCode = `#ifndef IMAGE_DATA_H
    #define IMAGE_DATA_H

    const int WIDTH = ${width};
    const int HEIGHT = ${height};
    const int CHANNELS = ${channels};

    const unsigned char imageData[] = {
    ${cppArray}
    };

    #endif // IMAGE_DATA_H
    `;
    const outputPath = path.resolve(DIST_PATH, imageName.split('.')[0] + '.h');
    fs.writeFileSync(outputPath, cppCode);
    console.log(`✅ Header file saved to: ${outputPath}`);
};

// Run it
imageToCpp(IMG_NAME).then(() => {
    process.exit(0);
}).catch((err) => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
