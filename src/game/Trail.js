export class Trail {
  constructor() {
    this.segments = [];
  }

  update(atom) {
    this.segments.unshift({ x: atom.x, y: atom.y });

    // Kapa energisvansen om den blir groteskt lång
    if (this.segments.length > 50) {
      this.segments.pop();
    }
  }

  extend() {
    // Förläng via att inte poppa bort segment
    this.segments.push({ ...this.segments[this.segments.length - 1] });
  }

  draw(r) {
    for (let i = 0; i < this.segments.length; i++) {
      const t = 1 - i / this.segments.length;
      r.circle(this.segments[i].x, this.segments[i].y, 5 * t, `rgba(0,255,255,${t})`);
    }
  }
}
