"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageToCpp = void 0;
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const helpers_1 = require("../util/helpers");
// Get paths from environment
const HOST_PATH = process.env['IMG_FOLDER'] || './';
const DIST_PATH = process.env['DIST_FOLDER'] || (0, helpers_1.getImageDistFolder)();
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
        cppArray += `${data[i]},`;
    }
    const obj = (0, helpers_1.imageFileNameToHeader)(imageName);
    const cppCode = `
    #ifndef ${obj.header}
    #define ${obj.header}

    const int ${obj.var}WIDTH = ${width};
    const int ${obj.var}HEIGHT = ${height};
    const int ${obj.var}CHANNELS = ${channels};

    const unsigned char ${obj.var}imageData[${width * height * channels}] = {
    ${cppArray}
    };

    #endif // ${obj.header}
    `;
    const outputDir = path_1.default.resolve(DIST_PATH, 'Textures');
    if (!fs_1.default.existsSync(outputDir)) {
        fs_1.default.mkdirSync(outputDir);
    }
    const outputPath = path_1.default.resolve(outputDir, obj.name);
    fs_1.default.writeFileSync(outputPath, cppCode);
    (0, helpers_1.imageNameArray)(outputDir, imageName);
    (0, helpers_1.updateMainHeader)(outputDir);
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
//   C:\code\MyGame\MyGame\src
//   C:\Users\shady\Downloads
