// TODO's //
// 1. Make one boson controlled by host move synchronously for everyone
// 2. Spawn a boson for every client
// 3. Make all bosons move synchronously for everyone



import { Game } from "./modules/Game.js";
import { mpapi } from "./modules/mpapi.js"
import { PlaySession } from "./modules/PlaySession.js";
import {Lobby} from './ui/lobby.js';

// --- INITIALIZATION ---

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

// const SERVER_URL = `${location.protocol === "https:" ? "wss" : "ws"}://localhost:8080/net`;
const APP_ID = "partycles-game"
const SERVER_URL = "wss://mpapi.se/net";
// let myClientId = null

const api = new mpapi(SERVER_URL, APP_ID);
const lobby = new Lobby()
const game = new Game(canvas, ctx, api);


// --- UI EVENTLISTENERS ---

// HOST Button
lobby.btnHost.addEventListener('click', async () => {
    const playerName = lobby.inputName.value.trim()
    game.host(lobby, playerName)
});

// JOIN Button
lobby.btnJoin.addEventListener('click', async () => {
    const sessionId = lobby.inputSession.value.trim();
    const playerName = lobby.inputName.value.trim()
    if (!sessionId) {
        alert("Please enter a Session ID first");
        return;
    }
    game.join(lobby, sessionId, playerName)
});

lobby.btnReady.addEventListener('click', () => {
    game.ready()   
});

// window.addEventListener("keydown", (event) => {
//     api.transmit({type: "keypress", key: event.key})
// })

api.listen((cmd, messageId, clientId, data) => {
    switch (cmd) {
        case 'game':
            console.log(cmd, clientId, data)
            if (data.isReady) game.start()
             // if (data.type === "keypress") console.log(data.name, data.key)
            // console.log(`Received message from ${clientId}: ${JSON.stringify(data)}`);
            break;
        case 'joined':
            console.log(`Player joined: ${data}(${clientId})`);
            // lägg till spelare i playSession.players hos Host
            console.log(game.playSession)
            // this.playSession.players.push({clientId: clientId, playerName: data.playerName})
            break;
        case 'left':
            console.log(`Player left: ${clientId}`);
            break;
        default:
            console.log('Unknown command:', cmd);
    }
});




// Start a single player game if chosen
// game.start();

