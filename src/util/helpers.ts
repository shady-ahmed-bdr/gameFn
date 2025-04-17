import { Cord, DataJosnImageList, MathFunction } from "../interfaces/math";
import fs from 'fs';
import path from 'path';
import { text } from "stream/consumers";
export const math = (mathFn: MathFunction, angle: number): number => {
    return +Math[mathFn](Math.PI / 180 * angle).toFixed(2);
}
export const stringFormaterCPP = (cord:Cord[])=>{
    let txt:string[] = [];
    cord.forEach((cord:Cord)=>{
        for (let key in cord) {
            if (cord.hasOwnProperty(key)) {
                cord[key] =  +cord[key].toFixed(2);
                if (cord[key] === 0) {
                    txt.push('0.0f');
                } else if (Number.isInteger(cord[key])) {
                    txt.push(`${cord[key]}.0f`);  // For integers, append 'f' without decimal
                } else {
                    txt.push(`${cord[key]}f`);  // For floating point numbers, append 'f' with decimal
                }
            }
        }
        const r = Math.random().toFixed(2)+'f'
        const g = Math.random().toFixed(2)+'f'
        const b = Math.random().toFixed(2)+'f'
        txt.push(r,g,b+'\n')
    })
    console.log(txt.length)
    return txt.join(', ');
}

export const imageFileNameToHeader = (name:string)=>{
    const obj = {name:'', header:'', var:''};
    obj.name =  name.split('.')[0]+'.h'
    obj.header = name.split('.')[0].toUpperCase()+'_H'
    obj.var = name.split('.')[0]+'_'
    return obj;
}
export const imageNameArray = (dist:string, imageName:string)=>{
    let file:DataJosnImageList={
        list:[],
        size:0,
        headerFIleName:'all_images.h',
        distination: dist
    };
    const dataPath = path.resolve(dist, 'data.txt')
    if(!fs.existsSync(dataPath)){
        file.list.push(imageName);
        file.size = file.list.length;
        file.headerFIleName = 'all_images.h';
        const str = JSON.stringify(file);
        fs.writeFileSync(dataPath,str);
        fs.writeFileSync('./temp/data.txt',str);
    }else{
        const strFile = fs.readFileSync(dataPath)
        if(strFile){
            file = JSON.parse(new TextDecoder().decode(strFile))
        }
        file.list.push(imageName);
        file.size = file.list.length;
        file.headerFIleName = 'all_images.h';
        const str = JSON.stringify(file);
        fs.writeFileSync('./temp/data.txt',str);
        fs.writeFileSync(dataPath,str);
    }
    return file.size;
}
export const updateMainHeader = (dist:string) =>{
    const files = fs.readdirSync(dist).filter(f => f.endsWith('.h') && f !== 'all_images.h');

    const includes = files.map(f => `#include "${f}"`).join('\n');

    const headerCode = `#ifndef ALL_IMAGES_H
    #define ALL_IMAGES_H

    ${includes}

    #endif // ALL_IMAGES_H
    `;
    fs.writeFileSync(path.join(dist, 'all_images.h'), headerCode);
    console.log('✅ all_images.h generated.');
}
export const getImageDistFolder =  ():string =>{
    let file:DataJosnImageList={
        list:[],
        size:0,
        headerFIleName:'all_images.h',
        distination: ''
    };

    const strFile = fs.readFileSync('./temp/data.txt')
    if(strFile){
        file = JSON.parse(new TextDecoder().decode(strFile))
    }
    return file.distination.slice(0, file.distination.length-1-('Textures'.length))
}