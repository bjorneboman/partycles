// TODO: Ta bort segmentSize? 

export class Trail {
  constructor(x, y) {
    this.size = 2
    this.segments = [{x: x, y: y}]
    this.segmentSize = 10
  }
  
  update(atom) {
    this.segments.unshift({ x: atom.x, y: atom.y })
    if (this.segments.length > this.size * this.segmentSize) {
      this.segments.pop();
    }
  }
  
  extend() {
    this.size++
  }
  
  vapourize(x, y) {
    this.size = 2
    this.segments = [{x: x, y: y}, {x: x, y: y}]
  }

  draw(r) {
    this.segments[1].y -= (this.segments[0].x - this.segments[1].x) * (Math.random() - .5) * 3
    this.segments[1].x -= (this.segments[0].y - this.segments[1].y) * (Math.random() - .5) * 3
    for (let i = 1; i < this.segments.length; i++) {
      const rollOff = 1 - i / this.segments.length
      r.boltTrail(
        this.segments[i-1].x, 
        this.segments[i-1].y, 
        this.segments[i].x, 
        this.segments[i].y, 
        1 * rollOff, 
        `rgba(0,255,255,${rollOff*.66 + .8})`
      )
    }
  }
}
