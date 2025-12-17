export function handleInput(atom) {
  window.addEventListener("keydown", e => {

    // Relative controls (only left and right arrows)
    // if (e.key === "ArrowLeft")
    //   if (atom.dir.x !== 0) {
    //     atom.dir.y = atom.dir.x * -1
    //     atom.dir.x = 0
    //   } else {
    //     atom.dir.x = atom.dir.y
    //     atom.dir.y = 0
    //   }
    //   if (e.key === "ArrowRight") {
    //     if (atom.dir.x !== 0) {
    //       atom.dir.y = atom.dir.x
    //       atom.dir.x = 0
    //     } else {
    //       atom.dir.x = atom.dir.y * -1
    //       atom.dir.y = 0
    //     }
    //   }

    // Absolute controls (up, down, left and right arrows)
    if (e.key === "ArrowUp") atom.dir = { x: 0, y: -1 };
    if (e.key === "ArrowDown") atom.dir = { x: 0, y: 1 };
    if (e.key === "ArrowLeft") atom.dir = { x: -1, y: 0 };
    if (e.key === "ArrowRight") atom.dir = { x: 1, y: 0 };
  });
}
/*

ArrowLeft
x: 1,   y: 0    =>  x: 0,   y: -1
x: 0,   y: -1   =>  x: -1,  y: 0
x: -1,  y: 0    =>  x: 0,   y: 1
x: 0,   y: 1    =>  x: 1,   y: 0

ArrowRight
x: 1,   y: 0    =>  x: 0,   y: 1
x: 0,   y: -1   =>  x: 1,   y: 0
x: -1,  y: 0    =>  x: 0,   y: -1
x: 0,   y: 1    =>  x: -1,   y: 0

*/