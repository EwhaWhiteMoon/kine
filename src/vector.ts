export class Vector {
  x: number;
  y: number;
  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }
  
  get size(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }
  set size(s: number) {
    this.normalize()
    this.x *= s;
    this.y *= s;
  }

  get angle(): number {
    return Math.atan2(this.y, this.x);
  }
  set angle(a: number){
    const s = this.size;
    this.x = Math.cos(a);
    this.y = Math.sin(a);
    this.size = s;
  }

  normalize(){
    this.x /= this.size;
    this.y /= this.size;
  }

  add(x: number, y: number) {
    this.x += x;
    this.y += y;
  }
  addVec(vec: Vector) {
    this.add(vec.x, vec.y);
  }

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  static add(a: Vector, b:Vector): Vector {
    return new Vector(a.x + b.x, a.y + b.y);
  }
}
