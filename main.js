// TODO's //
// 1. Make one boson controlled by host move synchronously for everyone
// 2. Spawn a boson for every client
// 3. Make all bosons move synchronously for everyone



import { Game } from "./modules/Game.js";
import { mpapi } from "./modules/mpapi.js"
import {Lobby} from './ui/lobby.js';

// const SERVER_URL = `${location.protocol === "https:" ? "wss" : "ws"}://localhost:8080/net`;
const APP_ID = "partycles-game"
const SERVER_URL = "wss://mpapi.se/net";
let myClientId = null
let playerName = ""
// const players = {
//     myClientId: {playerName: "Anon"}
// }


// --- INITIALIZATION ---
const api = new mpapi(SERVER_URL, APP_ID);
const lobby = new Lobby()

// HOST Button
lobby.btnHost.addEventListener('click', async () => {
    playerName = lobby.inputName.value.trim()

    game.host(playerName)
    // logToScreen("Attempting to host...");
});

// JOIN Button
lobby.btnJoin.addEventListener('click', async () => {
    const sessionId = lobby.inputSession.value.trim();
    playerName = lobby.inputName.value.trim()
    if (!sessionId) {
        alert("Please enter a Session ID first");
        return;
    }
    
    try {
        // .join() returns a Promise
        const response = await api.join(sessionId, {name: playerName || "Anon Player"});
        myClientId = response.clientId
        
        lobby.showStatusMessage(`You are currently in session ${sessionId} as "${playerName}"`);
        // updateSessionInfo()
        // switchToGameView(sessionId);
        
    } catch (err) {
        console.log(`Error joining: ${err}`);
        alert("Could not join. Check the console or ensure the ID is correct.");
    }
});

// TRANSMIT Button -> change to a "Ready"-button
lobby.btnPing.addEventListener('click', () => {
    const message = { 
        text: "Hello World!", 
        timestamp: Date.now(),
        name: playerName
    };
    
    // Send this object to everyone in the room
    api.transmit(message);
    
    console.log("You sent a message.");
});

window.addEventListener("keydown", (event) => {
    api.transmit({type: "keypress", clientId: myClientId, key: event.key})
})

async function updateSessionInfo() {
    try {
        const response = await api.list("clients")
        lobby.displaySessionInfo(JSON.stringify(response))

    } catch (err) {
        console.log(err)
    }
}

api.listen((cmd, messageId, clientId, data) => {
    switch (cmd) {
        case 'game':

        // if (data.type === "keypress") console.log(data.name, data.key)
            // console.log(`Received message from ${clientId}: ${JSON.stringify(data)}`);
            break;
        case 'joined':
            console.log(`Player joined: ${data.name}(${clientId})`);
            // ny mask
            break;
        case 'left':
            console.log(`Player left: ${clientId}`);
            break;
        default:
            console.log('Unknown command:', cmd);
    }
});



const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Kan uppgraderas till responsivt senare
canvas.width = 800;
canvas.height = 600;

// Start a single player game if chosen
// const game = new Game(canvas, ctx, api);
// game.start();

