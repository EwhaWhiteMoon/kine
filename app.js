(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
            if (obj.y < this.y && this.y < obj.y + obj.height
                && ((this.x - Ball.r < obj.x && obj.x < this.x + Ball.r)
                    || (this.x - Ball.r < obj.x + obj.width && obj.x + obj.width < this.x + Ball.r))) {
                this.vel.x *= -1;
            }
            while (obj.x < this.x + Ball.r && this.x - Ball.r < obj.x + obj.width
                && obj.y < this.y + Ball.r && this.y - Ball.r < obj.y + obj.height) {
                this.move(this.vel);
                this.kick(this.acc);
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
const mBox = new Box(ctx, 600, 600);
const ball1 = new Ball(150, 150);
ball1.accel(new vector_1.Vector(0.01, 0.1));
ball1.kick(new vector_1.Vector(3, 0));
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
    if (block1.x > 150 || block1.x < 50)
        i *= -1;
    window.requestAnimationFrame(main);
}
main();

},{"./vector":2}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector = void 0;
class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    get size() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    set size(s) {
        this.normalize();
        this.x *= s;
        this.y *= s;
    }
    get angle() {
        return Math.atan2(this.y, this.x);
    }
    set angle(a) {
        const s = this.size;
        this.x = Math.cos(a);
        this.y = Math.sin(a);
        this.size = s;
    }
    normalize() {
        this.x /= this.size;
        this.y /= this.size;
    }
    add(x, y) {
        this.x += x;
        this.y += y;
    }
    addVec(vec) {
        this.add(vec.x, vec.y);
    }
    set(x, y) {
        this.x = x;
        this.y = y;
    }
    static add(a, b) {
        return new Vector(a.x + b.x, a.y + b.y);
    }
}
exports.Vector = Vector;

},{}]},{},[1]);
