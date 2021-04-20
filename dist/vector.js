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
