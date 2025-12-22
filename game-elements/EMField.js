export class EMField {
  constructor(x, y) {
    this.size = 40
    this.path = [{x: x, y: y}]
  }
  
  update(atom) {
    this.path.unshift({ 
      x: atom.x, 
      y: atom.y
    })
    if (this.path.length > this.size) {
      this.path.pop();
      this.path[this.path.length - 1] = {x: atom.x, y: atom.y}
    }
  }
  
  draw(r, direction, isRunning) {
    this.path[1].x += (Math.random() - .5) * 40 + (isRunning ? direction.x * 20 : 0)
    this.path[1].y += (Math.random() - .5) * 40 + (isRunning ? direction.y * 20 : 0)
    for (let i = 1; i < this.path.length; i++) {
      const rollOff = 1 - i / this.path.length
      r.orbital(
        this.path[i-1].x, 
        this.path[i-1].y, 
        this.path[i].x, 
        this.path[i].y, 
        rollOff, 
        `rgba(128,255,255,${rollOff * .2 + 0})`
      )
    }
  }
}
