export class Trail {
  constructor() {
    this.size = 1
    this.segmentSize = 10
    this.segments = [];
  }
  
  update(atom) {
    this.segments.unshift({ x: atom.x, y: atom.y });
    
    // Kapa energisvansen om den blir groteskt lång
    if (this.segments.length > this.size * this.segmentSize) {
      this.segments.pop();
    }
  }
  
  extend() {
    this.size++
  }
  
  vapourize() {
    this.size = 1
    this.segmentSize = 10
    this.segments = [];
  }

  draw(r) {
    for (let i = 0; i < this.segments.length; i++) {
      const t = 1 - i / this.segments.length;
      r.circle(this.segments[i].x, this.segments[i].y, 5 * t, `rgba(0,255,255,${t})`);
    }
  }
}
