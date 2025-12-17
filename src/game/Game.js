import { Atom } from "./Atom.js";
import { Photon } from "./Photon.js";
import { handleInput } from "./Input.js";
import { Renderer } from "./Renderer.js";
import { randomPhotonPosition } from "../utils/random.js";

export class Game {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;

    this.gameLenghtInSeconds = 60
    this.timeLeft = this.gameLenghtInSeconds
    this.clockElement = document.querySelector("#clock")
    this.timer = null


    this.atom = new Atom(100, 100);
    this.photons = [];

    this.renderer = new Renderer(ctx);
    this.running = false;

    handleInput(this.atom);
  }

  start() {
    // Pre-spawn photons
    for (let i = 0; i < 3; i++) {
      const { x, y } = randomPhotonPosition(this.canvas);
      this.photons.push(new Photon(x, y));
    }

    this.running = true;
    this.loop();
    this.timer = setInterval(() => {this.gameClock()}, 1000)
  }
  
  gameClock() {
    if (this.timeLeft <= 0) {
      this.running = false;
      clearInterval(this.timer)
      return
    }
    this.timeLeft -= 1
    this.clockElement.textContent = this.timeLeft
  }
  
  loop() {
    if (!this.running) return;
    
    this.update();
    this.render();

    requestAnimationFrame(() => this.loop());
  }

  update() {
    this.atom.update();
  
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
    if (this.atom.collidesWithWall(this.canvas)) this.annihilation(this.atom, this.trail)
      
    // TODO: Kollisioner med egen svans
    

  }
  annihilation(atom, trail) { 
    atom.annihilateAndRespawn()
  }

  render() {
    this.renderer.clear(this.canvas);
    this.photons.forEach(p => p.draw(this.renderer));
    this.atom.draw(this.renderer);
  }
}
