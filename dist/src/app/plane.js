"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plane = void 0;
const helpers_1 = require("../util/helpers");
const Plane = (cord, dx, dz, xAngle, yAngle, zAngle) => {
    const vecX = { x: dx, y: 0, z: 0 };
    const vecZ = { x: 0, y: 0, z: dz };
    const rotX = rotate(vecX, xAngle, yAngle, zAngle);
    const rotZ = rotate(vecZ, xAngle, yAngle, zAngle);
    const p0 = cord;
    const p1 = { x: cord.x + rotX.x, y: cord.y + rotX.y, z: cord.z + rotX.z };
    const p2 = { x: cord.x + rotZ.x, y: cord.y + rotZ.y, z: cord.z + rotZ.z };
    const p3 = {
        x: cord.x + rotX.x + rotZ.x,
        y: cord.y + rotX.y + rotZ.y,
        z: cord.z + rotX.z + rotZ.z,
    };
    return (0, helpers_1.stringFormaterCPP)([p0, p2, p3, p1]); //0.0f, 0.0f, 0.0f, 10.0f, 0.0f, 0.0f, 0.0f, 10.0f, 0.0f, 10.0f, 10.0f, 0.0f
};
exports.Plane = Plane;
const rotate = (v, xA, yA, zA) => {
    const cx = (0, helpers_1.math)("cos", xA), sx = (0, helpers_1.math)("sin", xA);
    const cy = (0, helpers_1.math)("cos", yA), sy = (0, helpers_1.math)("sin", yA);
    const cz = (0, helpers_1.math)("cos", zA), sz = (0, helpers_1.math)("sin", zA);
    // Rotate around X
    let y1 = v.y * cx - v.z * sx;
    let z1 = v.y * sx + v.z * cx;
    let x1 = v.x;
    // Rotate around Y
    let x2 = x1 * cy + z1 * sy;
    let z2 = -x1 * sy + z1 * cy;
    let y2 = y1;
    // Rotate around Z
    let x3 = x2 * cz - y2 * sz;
    let y3 = x2 * sz + y2 * cz;
    let z3 = z2;
    return { x: x3, y: y3, z: z3 };
};
