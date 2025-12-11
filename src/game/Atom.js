export class Atom {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 3;
    this.dir = { x: 1, y: 0 };
    this.radius = 10;
  }

  update() {
    this.x += this.dir.x * this.speed;
    this.y += this.dir.y * this.speed;
  }

  collidesWith(photon) {
    const dx = this.x - photon.x;
    const dy = this.y - photon.y;
    return dx * dx + dy * dy < (this.radius + photon.radius) ** 2;
  }

  draw(r) {
    r.circle(this.x, this.y, this.radius, "cyan");
  }
}
