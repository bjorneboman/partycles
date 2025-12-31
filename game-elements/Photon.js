export class Photon {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 6;
  }

  draw(r) {
    const jitter = {x: (Math.random() - .5) * 2, y: (Math.random() - .5) * 2 }
    r.circle(this.x + jitter.x, this.y + jitter.y, this.radius, "255,245,100");
  }
}
