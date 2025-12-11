export function randomPhotonPosition(canvas) {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height
  };
}
