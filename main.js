import { Game } from "./src/game/Game.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Kan uppgraderas till responsivt senare
canvas.width = 800;
canvas.height = 600;

const game = new Game(canvas, ctx);
game.start();
