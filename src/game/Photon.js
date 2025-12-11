export class Photon {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 6;
  }

  draw(r) {
    r.circle(this.x, this.y, this.radius, "yellow");
  }
}
