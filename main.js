// TODO's //
// 1. Make one boson controlled by host move synchronously for everyone
// 2. Spawn a boson for every client
// 3. Make all bosons move synchronously for everyone

import { Game } from "./modules/Game.js"
import { mpapi } from "./modules/mpapi.js"
import { PlaySession } from "./modules/PlaySession.js"
import { Lobby } from "./ui/lobby.js"

// --- INITIALIZATION ---

const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")
canvas.width = 800
canvas.height = 600

// const SERVER_URL = `${location.protocol === "https:" ? "wss" : "ws"}://localhost:8080/net`;
const APP_ID = "partycles-game"
const SERVER_URL = "wss://mpapi.se/net"
// let myClientId = null

const api = new mpapi(SERVER_URL, APP_ID)
const lobby = new Lobby()
const game = new Game(canvas, ctx, api)

// --- UI EVENTLISTENERS ---

// HOST Button
lobby.btnHost.addEventListener("click", async () => {
  const playerName = lobby.inputName.value.trim()
  game.host(lobby, playerName)
})

// JOIN Button
lobby.btnJoin.addEventListener("click", async () => {
  const sessionId = lobby.inputSession.value.trim()
  const playerName = lobby.inputName.value.trim()
  if (!sessionId) {
    alert("Please enter a Session ID first")
    return
  }
  game.join(lobby, sessionId, playerName)
})

lobby.btnReady.addEventListener("click", () => {
  game.ready()
})

// window.addEventListener("keydown", (event) => {
//     api.transmit({type: "keypress", key: event.key})
// })

api.listen((cmd, messageId, clientId, data) => {
  switch (cmd) {
    case "game":
      let senderReference = null
      if (game.hostPlaySession) {
        senderReference = game.hostPlaySession.players.findIndex(
          (p) => p.clientId === clientId
        )
      }

      // When receiving "player info" from client, update those properties for that client in the players array
      if (data.type === "playerInfo" && game.hostPlaySession) {
        game.hostPlaySession.players[senderReference].playerName =
          data.playerInfo.playerName
        console.log(game.hostPlaySession.players)
      }

      // When receiving "ready to play" from client, set that client to "isReady" in the players array
      if (data.isReady && game.hostPlaySession) {
        console.log(game.hostPlaySession.players)
        game.hostPlaySession.players[senderReference].isReady = true

        // Check if all players are ready, if so transmit game start
        if (game.hostPlaySession.players.find((p) => p.isReady === false))
          return null
        else {
          const initPhotons = game.initPhotons()
          api.transmit({ type: "startgame", levelInit: initPhotons })
        }
      }

      if (data.type === "startgame") {
        game.start(data.levelInit)
      }

      // Handle incoming game tick (playSession.frame), pass on to rendering
      if (data.type === "tickForward") {
        game.hostPlaySession
          ? game.hostPlaySession.handleTick(data.playerPositions)
          : game.playSession.handleTick(data.playerPositions)
      }

      break
    case "joined":
      console.log(`Player joined: ${JSON.stringify(data)}(${clientId})`)
      // lägg till spelare i hostPlaySession.players hos Host
      if (game.hostPlaySession)
        game.hostPlaySession.players.push({
          clientId: clientId,
          playerName: data.playerName,
        })
      console.log(game.hostPlaySession.players)
      // this.playSession.players.push({clientId: clientId, playerName: data.playerName})
      break
    case "left":
      console.log(`Player left: ${clientId}`)
      break
    default:
      console.log("Unknown command:", cmd)
  }
})

// Start a single player game if chosen
// game.start();
