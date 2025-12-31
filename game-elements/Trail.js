// IMPORTANT: Call destroy() before discarding

// TODO: Ta bort segmentSize?

export class Trail {
  constructor(x, y) {
    this.size = 2
    this.segments = [{ x: x, y: y }]
    this.segmentSize = 10
  }

  update(boson) {
    this.segments.unshift({ x: boson.x, y: boson.y })
    if (this.segments.length > this.size * this.segmentSize) {
      this.segments.pop()
    }
  }

  extend() {
    this.size++
  }

  reset(_x, _y) {
    this.size = 2
    // this.segments.length = 0
    this.segments = [
      { x: _x, y: _y },
      { x: _x, y: _y },
    ]
  }

  destroy() {
    this.segments.length = 0;
    this.segments = null;
  }


  draw(r) {
    this.segments[1].y -=
      (this.segments[0].x - this.segments[1].x) * (Math.random() - 0.5) * 3
    this.segments[1].x -=
      (this.segments[0].y - this.segments[1].y) * (Math.random() - 0.5) * 3
    for (let i = 1; i < this.segments.length; i++) {
      const rollOff = 1 - i / this.segments.length
      r.boltTrail(
        this.segments[i - 1].x,
        this.segments[i - 1].y,
        this.segments[i].x,
        this.segments[i].y,
        1 * rollOff,
        `rgba(0,255,255,${rollOff * 0.66 + 0.8})`
      )
    }
  }
}
