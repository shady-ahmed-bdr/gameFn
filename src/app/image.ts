import sharp from "sharp";
import fs from "fs";
import path from "path";
import { getImageDistFolder, imageFileNameToHeader, imageNameArray, updateMainHeader } from "../util/helpers";

// Get paths from environment
const HOST_PATH = process.env['IMG_FOLDER'] || './';
const DIST_PATH = process.env['DIST_FOLDER'] || getImageDistFolder();
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
        cppArray+=`${data[i]},`;
    }
    const obj = imageFileNameToHeader(imageName)
    const cppCode = `
    #ifndef ${obj.header}
    #define ${obj.header}

    const int ${obj.var}WIDTH = ${width};
    const int ${obj.var}HEIGHT = ${height};
    const int ${obj.var}CHANNELS = ${channels};

    const unsigned char ${obj.var}imageData[${width*height * channels}] = {
    ${cppArray}
    };

    #endif // ${obj.header}
    `;
    const outputDir =  path.resolve(DIST_PATH,'Textures');
    
    if(!fs.existsSync(outputDir)){
        fs.mkdirSync(outputDir);    
    }

    const outputPath = path.resolve(outputDir, obj.name);
    fs.writeFileSync(outputPath, cppCode);
    imageNameArray(outputDir,imageName)
    updateMainHeader(outputDir)
    console.log(`✅ Header file saved to: ${outputPath}`);
};

// Run it
imageToCpp(IMG_NAME).then(() => {
    process.exit(0);
}).catch((err) => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
//   C:\code\MyGame\MyGame\src
//   C:\Users\shady\Downloads