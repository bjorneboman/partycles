import { Trail } from "./Trail.js";

export class Atom {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 3;
    this.dir = { x: 1, y: 0 };
    this.radius = 10;

    this.trail = new Trail()
  }
  
  update() {
    this.x += this.dir.x * this.speed;
    this.y += this.dir.y * this.speed;
    this.trail.update(this);
  }
  
  collidesWithPhoton(photon) {
    const dx = this.x - photon.x;
    const dy = this.y - photon.y;
    return dx * dx + dy * dy < (this.radius + photon.radius) ** 2;
  }
  
  collidesWithWall(canvas) {
    return (
      this.x - this.radius <= 0 ||
      this.x + this.radius >= canvas.width ||
      this.y - this.radius <= 0 ||
      this.y + this.radius >= canvas.height
    )
  }
  extend() {
    this.trail.extend()
  }
  annihilateAndRespawn() {
    this.x = 100
    this.y = 100
    this.dir = { x: 1, y: 0 };
    this.trail.vapourize()
  }

  draw(r) {
    r.circle(this.x, this.y, this.radius, "cyan");
    this.trail.draw(r);

  }
}
