export function randomPhotonPosition(canvas) {
  return {
    x: Math.floor(Math.random() * canvas.width),
    y: Math.floor(Math.random() * canvas.height)
  };
}
