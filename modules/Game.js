import { Atom } from "../game-elements/Boson.js";
import { Photon } from "../game-elements/Photon.js";
import { handleInput } from "../ui/Input.js";
import { Renderer } from "../game-elements/Renderer.js";
import { randomPhotonPosition } from "../utils/random.js";

export class Game {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;

    this.gameLenghtInSeconds = 10
    this.timeLeft = this.gameLenghtInSeconds
    this.clockElement = document.querySelector("#clock")
    this.timer = null


    this.atom = new Atom(100, 100);
    this.photons = [];

    this.renderer = new Renderer(ctx);
    this.isRunning = false;

    handleInput(this.atom);
  }

  start() {
    this.clockElement.textContent = this.timeLeft
    // Pre-spawn photons
    for (let i = 0; i < 5; i++) {
      const { x, y } = randomPhotonPosition(this.canvas);
      this.photons.push(new Photon(x, y));
    }
    // Reset game data

    // Reposition Atom and set direction

    this.isRunning = true;
    this.loop();
    this.timer = setInterval(() => {this.gameClock()}, 1000)
  }
  
  gameClock() {
    if (this.timeLeft <= 0) {
      this.isRunning = false;
      clearInterval(this.timer)
      this.gameOver()
    } else {
      this.clockElement.textContent = this.timeLeft
    this.timeLeft -= 1
    }
  }
  
  loop() {
    this.update(this.isRunning);
    this.render();
    requestAnimationFrame(() => this.loop());
  }

  update(isRunning) {
    this.atom.update(isRunning);
  
    if(isRunning) {
    // Foton-kollisioner
    for (let i = 0; i < this.photons.length; i++) {
      const p = this.photons[i];
      if (this.atom.collidesWithPhoton(p)) {
        this.photons.splice(i, 1);
        this.atom.extend();

        // Spawn ny foton
        const { x, y } = randomPhotonPosition(this.canvas);
        this.photons.push(new Photon(x, y));
      }
    }
    
    // Kollisioner med vägg
    if (this.atom.collidesWithWall(this.canvas)) this.annihilation(this.atom)
      
    // TODO: Kollisioner med egen svans
    
    }
  }
  annihilation(atom) { 
    atom.annihilateAndRespawn()
  }

  gameOver() {
    this.clockElement.textContent = "GAME OVER"

  }

  render() {
    this.renderer.clear(this.canvas)
    if (this.isRunning) this.photons.forEach(p => p.draw(this.renderer))
    this.atom.draw(this.renderer, this.isRunning)
  }
}
