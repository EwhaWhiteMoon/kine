import { Vector } from './vector'

const canvas: HTMLCanvasElement = document.getElementById("MCanvas") as HTMLCanvasElement;
const ctx:CanvasRenderingContext2D = canvas!.getContext("2d") as CanvasRenderingContext2D;

interface Obj {
  x: number;
  y: number;
  frame(box: Box): void;
  draw(ctx: CanvasRenderingContext2D): void;
}

class Box {
  private readonly ctx: CanvasRenderingContext2D;
  readonly height: number;
  readonly width: number;
  objs: Obj[];  
  constructor(ctx: CanvasRenderingContext2D, height: number, width: number) {
    this.ctx = ctx;
    this.height = height;
    this.width = width;
    this.objs = [];
  }
  frame() {
    this.objs.forEach(o => o.frame(this));
  }
  draw() {
    this.ctx.clearRect(0, 0, this.height, this.width);
    this.objs.forEach(o => o.draw(this.ctx));
  }
  addObj(obj: Obj) {
    this.objs.push(obj);
  }
}

class Ball implements Obj{
  x: number;
  y: number;
  private static readonly r = 10;
  private vel: Vector;
  private acc: Vector;
  constructor(x: number, y: number){
    this.x = x;
    this.y = y;
    this.vel = new Vector();
    this.acc = new Vector();
  }
  collusion(obj: Obj){
    if(obj instanceof Block){
      if(obj.x < this.x && this.x < obj.x + obj.width
        &&((this.y - Ball.r < obj.y && obj.y < this.y + Ball.r)
        ||(this.y - Ball.r < obj.y + obj.height && obj.y + obj.height < this.y + Ball.r))){
          this.vel.y *= -1;
      }
      if(obj.y < this.y && this.y < obj.y + obj.height
        &&((this.x - Ball.r < obj.x && obj.x < this.x + Ball.r)
        ||(this.x - Ball.r < obj.x + obj.width && obj.x + obj.width < this.x + Ball.r))){
          this.vel.x *= -1;
      }
      while(obj.x < this.x + Ball.r && this.x - Ball.r < obj.x + obj.width
      && obj.y < this.y + Ball.r && this.y - Ball.r < obj.y + obj.height){
        this.move(this.vel);
        this.kick(this.acc);
      }
    }
  }
  frame(box: Box){
    this.kick(this.acc);
    this.move(this.vel);

    box.objs.forEach(this.collusion.bind(this));

    if(this.y > box.height - Ball.r/2){
      this.vel.y *= -1;
      this.move(this.vel);
    }
    if(this.x > box.width - Ball.r/2 || this.x <0){
      this.vel.x *= -1;
      this.move(this.vel);
    }
  }
  draw(ctx: CanvasRenderingContext2D){
    ctx.beginPath();
    ctx.arc(this.x, this.y, Ball.r, 0, Math.PI*2);
    ctx.fill();

    ctx.font = '15px serif';
    ctx.fillText(`x:${Math.floor(this.x)}, y:${Math.floor(this.y)}, vel:(${this.vel.x}, ${this.vel.y})`, 5, 20);
  }
  move({x, y}: Vector){
    this.x += x;
    this.y += y;
  }
  kick({x, y}: Vector){
    this.vel.add(x, y);
  }
  accel({x, y}: Vector){
    this.acc.add(x, y);
  }
}

class Block implements Obj{
  x: number;
  y: number;
  height: number;
  width: number;
  constructor(x: number, y: number, width: number, height: number){
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
  }

  frame(box: Box){

  }
  draw(ctx: CanvasRenderingContext2D){
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.font = '10px serif';
    ctx.fillText(`x:${this.x} ~ ${this.x + this.width}, y:${this.y} ~ ${this.y + this.height}`, this.x, this. y - 15);
  }
}

const mBox = new Box(ctx, 600, 600);

const ball1 = new Ball(150, 150);
ball1.accel(new Vector(0.01, 0.1));
ball1.kick(new Vector(3,0));

const block1 = new Block(50, 200, 150, 15);
const block2 = new Block(150, 200, 300, 80);

mBox.addObj(ball1);
mBox.addObj(block1);
mBox.addObj(block2);

let i = 1;

function main() {
  mBox.frame();
  mBox.draw();

  block1.x += i;
  if(block1.x > 150 || block1.x < 50) i *= -1;

  window.requestAnimationFrame(main);
}

main();