"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageToCpp = void 0;
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Get paths from environment
const HOST_PATH = process.env['IMG_FOLDER'] || './';
const DIST_PATH = process.env['DIST_FOLDER'] || './';
const IMG_NAME = process.env['IMG_FILE'];
const imageToCpp = async (imageName) => {
    if (!imageName) {
        throw new Error('No image was selected.');
    }
    const imagePath = path_1.default.resolve(HOST_PATH, imageName);
    const image = await (0, sharp_1.default)(imagePath).raw().toBuffer({ resolveWithObject: true });
    const { data, info } = image;
    const { width, height, channels } = info;
    // Format pixel data into a C++ array
    let cppArray = '';
    for (let i = 0; i < data.length; i++) {
        cppArray += `${data[i]}, `;
        if ((i + 1) % (channels * width) === 0)
            cppArray += '\n';
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
    const outputPath = path_1.default.resolve(DIST_PATH, imageName.split('.')[0] + '.h');
    fs_1.default.writeFileSync(outputPath, cppCode);
    console.log(`✅ Header file saved to: ${outputPath}`);
};
exports.imageToCpp = imageToCpp;
// Run it
(0, exports.imageToCpp)(IMG_NAME).then(() => {
    process.exit(0);
}).catch((err) => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
