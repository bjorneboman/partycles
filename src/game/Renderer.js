export class Renderer {
  constructor(ctx) {
    this.ctx = ctx;
  }

  clear(canvas) {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  circle(x, y, radius, color) {
    this.ctx.save()
    
    this.ctx.fillStyle = color
    this.ctx.shadowColor = color
    this.ctx.shadowBlur = 10
    
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.restore()
  }
  boltTrail(fromX, fromY, toX, toY, lineWidth, color) {
    this.ctx.save()
    
    this.ctx.strokeStyle = color
    this.ctx.lineWidth = lineWidth
    this.ctx.lineCap = "round"
    this.ctx.shadowColor = color
    this.ctx.shadowBlur = 5
    
    this.ctx.beginPath()
    this.ctx.moveTo(fromX, fromY)
    this.ctx.lineTo(toX, toY)
    this.ctx.stroke()
    
    this.ctx.restore()
  }
  orbital(fromX, fromY, toX, toY, lineWidth, color) {
    this.ctx.save()
    
    this.ctx.strokeStyle = color
    this.ctx.lineWidth = lineWidth
    this.ctx.lineCap = "round"
    this.ctx.shadowColor = color
    this.ctx.shadowBlur = 5
    
    this.ctx.beginPath()
    this.ctx.moveTo(fromX, fromY)
    this.ctx.lineTo(toX, toY)
    this.ctx.stroke()
    
    this.ctx.restore()
  }
}
