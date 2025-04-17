"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImageDistFolder = exports.updateMainHeader = exports.imageNameArray = exports.imageFileNameToHeader = exports.stringFormaterCPP = exports.math = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const math = (mathFn, angle) => {
    return +Math[mathFn](Math.PI / 180 * angle).toFixed(2);
};
exports.math = math;
const stringFormaterCPP = (cord) => {
    let txt = [];
    cord.forEach((cord) => {
        for (let key in cord) {
            if (cord.hasOwnProperty(key)) {
                cord[key] = +cord[key].toFixed(2);
                if (cord[key] === 0) {
                    txt.push('0.0f');
                }
                else if (Number.isInteger(cord[key])) {
                    txt.push(`${cord[key]}.0f`); // For integers, append 'f' without decimal
                }
                else {
                    txt.push(`${cord[key]}f`); // For floating point numbers, append 'f' with decimal
                }
            }
        }
        const r = Math.random().toFixed(2) + 'f';
        const g = Math.random().toFixed(2) + 'f';
        const b = Math.random().toFixed(2) + 'f';
        txt.push(r, g, b + '\n');
    });
    console.log(txt.length);
    return txt.join(', ');
};
exports.stringFormaterCPP = stringFormaterCPP;
const imageFileNameToHeader = (name) => {
    const obj = { name: '', header: '', var: '' };
    obj.name = name.split('.')[0] + '.h';
    obj.header = name.split('.')[0].toUpperCase() + '_H';
    obj.var = name.split('.')[0] + '_';
    return obj;
};
exports.imageFileNameToHeader = imageFileNameToHeader;
const imageNameArray = (dist, imageName) => {
    let file = {
        list: [],
        size: 0,
        headerFIleName: 'all_images.h',
        distination: dist
    };
    const dataPath = path_1.default.resolve(dist, 'data.txt');
    if (!fs_1.default.existsSync(dataPath)) {
        file.list.push(imageName);
        file.size = file.list.length;
        file.headerFIleName = 'all_images.h';
        const str = JSON.stringify(file);
        fs_1.default.writeFileSync(dataPath, str);
        fs_1.default.writeFileSync('./temp/data.txt', str);
    }
    else {
        const strFile = fs_1.default.readFileSync(dataPath);
        if (strFile) {
            file = JSON.parse(new TextDecoder().decode(strFile));
        }
        file.list.push(imageName);
        file.size = file.list.length;
        file.headerFIleName = 'all_images.h';
        const str = JSON.stringify(file);
        fs_1.default.writeFileSync('./temp/data.txt', str);
        fs_1.default.writeFileSync(dataPath, str);
    }
    return file.size;
};
exports.imageNameArray = imageNameArray;
const updateMainHeader = (dist) => {
    const files = fs_1.default.readdirSync(dist).filter(f => f.endsWith('.h') && f !== 'all_images.h');
    const includes = files.map(f => `#include "${f}"`).join('\n');
    const headerCode = `#ifndef ALL_IMAGES_H
    #define ALL_IMAGES_H

    ${includes}

    #endif // ALL_IMAGES_H
    `;
    fs_1.default.writeFileSync(path_1.default.join(dist, 'all_images.h'), headerCode);
    console.log('✅ all_images.h generated.');
};
exports.updateMainHeader = updateMainHeader;
const getImageDistFolder = () => {
    let file = {
        list: [],
        size: 0,
        headerFIleName: 'all_images.h',
        distination: ''
    };
    const strFile = fs_1.default.readFileSync('./temp/data.txt');
    if (strFile) {
        file = JSON.parse(new TextDecoder().decode(strFile));
    }
    return file.distination.slice(0, file.distination.length - 1 - ('Textures'.length));
};
exports.getImageDistFolder = getImageDistFolder;
