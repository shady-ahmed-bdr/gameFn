"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringFormaterCPP = exports.math = void 0;
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
        txt.push(r, g, b);
    });
    console.log(txt.length);
    return txt.join(', ');
};
exports.stringFormaterCPP = stringFormaterCPP;
