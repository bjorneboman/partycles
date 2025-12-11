import { Atom } from "./Atom.js";
import { Photon } from "./Photon.js";
import { Trail } from "./Trail.js";
import { handleInput } from "./Input.js";
import { Renderer } from "./Renderer.js";
import { randomPhotonPosition } from "../utils/random.js";

export class Game {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;

    this.atom = new Atom(100, 100);
    this.trail = new Trail();
    this.photons = [];

    this.renderer = new Renderer(ctx);
    this.running = false;

    handleInput(this.atom);
  }

  start() {
    // Pre-spawn ett gäng fotoner
    for (let i = 0; i < 3; i++) {
      const { x, y } = randomPhotonPosition(this.canvas);
      this.photons.push(new Photon(x, y));
    }

    this.running = true;
    this.loop();
  }

  loop() {
    if (!this.running) return;

    this.update();
    this.render();

    requestAnimationFrame(() => this.loop());
  }

  update() {
    this.atom.update();
    this.trail.update(this.atom);

    // Foton-kollisioner
    for (let i = this.photons.length - 1; i >= 0; i++) {
      const p = this.photons[i];
      if (this.atom.collidesWith(p)) {
        this.photons.splice(i, 1);
        this.trail.extend();

        // Spawn ny foton
        const { x, y } = randomPhotonPosition(this.canvas);
        this.photons.push(new Photon(x, y));
      }
    }
  }

  render() {
    this.renderer.clear(this.canvas);
    this.trail.draw(this.renderer);
    this.photons.forEach(p => p.draw(this.renderer));
    this.atom.draw(this.renderer);
  }
}
