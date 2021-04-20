"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vector_1 = require("./vector");
const canvas = document.getElementById("MCanvas");
const ctx = canvas.getContext("2d");
class Box {
    constructor(ctx, height, width) {
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
    addObj(obj) {
        this.objs.push(obj);
    }
}
class Ball {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vel = new vector_1.Vector();
        this.acc = new vector_1.Vector();
    }
    collusion(obj) {
        if (obj instanceof Block) {
            if (obj.x < this.x && this.x < obj.x + obj.width
                && ((this.y - Ball.r < obj.y && obj.y < this.y + Ball.r)
                    || (this.y - Ball.r < obj.y + obj.height && obj.y + obj.height < this.y + Ball.r))) {
                this.vel.y *= -1;
            }
        }
    }
    frame(box) {
        this.kick(this.acc);
        this.move(this.vel);
        box.objs.forEach(this.collusion.bind(this));
        if (this.y > box.height - Ball.r / 2) {
            this.vel.y *= -1;
            this.move(this.vel);
        }
        if (this.x > box.width - Ball.r / 2 || this.x < 0) {
            this.vel.x *= -1;
            this.move(this.vel);
        }
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, Ball.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = '15px serif';
        ctx.fillText(`x:${Math.floor(this.x)}, y:${Math.floor(this.y)}, vel:(${this.vel.x}, ${this.vel.y})`, 5, 20);
    }
    move({ x, y }) {
        this.x += x;
        this.y += y;
    }
    kick({ x, y }) {
        this.vel.add(x, y);
    }
    accel({ x, y }) {
        this.acc.add(x, y);
    }
}
Ball.r = 10;
class Block {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
    }
    frame(box) {
    }
    draw(ctx) {
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.font = '10px serif';
        ctx.fillText(`x:${this.x} ~ ${this.x + this.width}, y:${this.y} ~ ${this.y + this.height}`, this.x, this.y - 15);
    }
}
const mBox = new Box(ctx, 300, 300);
const ball1 = new Ball(150, 150);
ball1.accel(new vector_1.Vector(0, 0.1));
ball1.kick(new vector_1.Vector(3, 0));
const block1 = new Block(50, 200, 150, 15);
mBox.addObj(ball1);
mBox.addObj(block1);
let i = 1;
function main() {
    mBox.frame();
    mBox.draw();
    block1.x += i;
    if (block1.x > 150 || block1.x < 50)
        i *= -1;
    window.requestAnimationFrame(main);
}
main();
