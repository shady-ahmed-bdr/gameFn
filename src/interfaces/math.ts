export type MathFunction =
  | "sin"
  | "cos"
  | "tan"
  | "asin"
  | "acos"
  | "atan"
  | "sinh"
  | "cosh"
  | "tanh";


export interface Cord {
  x:number; 
  z:number; 
  y:number;
  [key: string]: number;
}