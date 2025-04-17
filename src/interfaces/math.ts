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
export interface DataJosnImageList{
  list:string[];
  size:number;
  headerFIleName:string;
  distination:string;
}