import { Trail } from "./Trail.js";
import { EMField } from "./EMField.js";

export class Boson {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.lineUp = {x: 50, y: 50}
    this.speed = 5;
    this.dir = { x: 1, y: 0 };
    this.radius = 10;

    this.orbital = new EMField(this.x, this.y)
    this.trail = new Trail(this.x, this.y)
  }
  
  update(isRunning) {
    if (isRunning) {
    this.x += this.dir.x * this.speed;
    this.y += this.dir.y * this.speed;
    } else {
      this.x += (this.lineUp.x - this.x) * .3 + Math.random()-.5
      this.y += (this.lineUp.y - this.y) * .3 + Math.random()-.5
    }
    this.trail.update(this)
    this.orbital.update(this)
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
    this.trail.vapourize(this.x, this.y)
  }

  draw(r, isRunning) {
    r.circle(this.x, this.y, this.radius, "cyan");
    this.orbital.draw(r, this.dir, isRunning)
    this.trail.draw(r);

  }
}
