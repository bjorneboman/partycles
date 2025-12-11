export class Renderer {
  constructor(ctx) {
    this.ctx = ctx;
  }

  clear(canvas) {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  circle(x, y, radius, color) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }
}
