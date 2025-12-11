export function handleInput(atom) {
  window.addEventListener("keydown", e => {
    if (e.key === "ArrowUp") atom.dir = { x: 0, y: -1 };
    if (e.key === "ArrowDown") atom.dir = { x: 0, y: 1 };
    if (e.key === "ArrowLeft") atom.dir = { x: -1, y: 0 };
    if (e.key === "ArrowRight") atom.dir = { x: 1, y: 0 };
  });
}
