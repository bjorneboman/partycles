// TODO's //
// 2. Spawn a boson for every client
// 3. Make all bosons move synchronously for everyone

import { Game } from "./modules/Game.js"
import { mpapi } from "./modules/mpapi.js"
import { PlaySession } from "./modules/PlaySession.js"
import { Lobby } from "./ui/lobby.js"
import { handleInput } from "./ui/Input.js"

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

api.listen((cmd, messageId, clientId, data) => {
  switch (cmd) {
    case "game":
      let senderReference = null
      if (game.playSession) {
        senderReference = game.playSession.players.findIndex(
          (p) => p.clientId === clientId
        )
      }

      // Handeling player input
      if (data.type === "keypress") {
        const boson = game.playSession.players[senderReference].boson
        handleInput(boson, data.key)
      }

      // When receiving "player info" from client, update those properties for that client in the players array
      if (data.type === "playerInfo" && game.playSession.isHost) {
        game.playSession.players[senderReference].playerName =
          data.playerInfo.playerName
      }

      // When receiving "ready to play" from client, set that client to "isReady" in the players array
      if (data.type === "isReady" && game.playSession.isHost) {
        game.playSession.players[senderReference].isReady = true

        // Check if all players are ready, if so transmit game start
        let go = true
        game.playSession.players.forEach((p) => {
          if (!p.isReady) go = false
        })
        if (go) {
          const initPhotons = game.initPhotons()
          api.transmit({
            type: "startgame",
            levelInit: initPhotons,
            playersList: game.playSession.players,
          })
        }
      }

      if (data.type === "startgame") {
        window.addEventListener("keydown", (event) =>
          api.transmit({ type: "keypress", key: event.key })
        )
        if (!game.playSession.isHost)
          game.playSession.players = data.playersList
        game.start(data.levelInit)
      }

      // Handle incoming game tick (playSession.frame), pass on to rendering
      if (data.type === "tickForward") game.tickForward(data.playerPositions)

      // Handle incoming photon absorbtion
      if (data.type === "photonAbsorbtion") {
        // Update photons array
        game.photons.forEach((p, i) => {
          p.x = data.photons[i].x
          p.y = data.photons[i].y
        })

        // Update boson state of absorbant player
        game.playSession.players[data.playerIndex].boson.extend()
      }
      break

    case "joined":
      console.log(`Player joined: ${JSON.stringify(data)}(${clientId})`)
      // lägg till spelare i hostPlaySession.players hos Host
      if (game.playSession.isHost)
        game.playSession.players.push({
          clientId: clientId,
          playerName: data.playerName,
        })
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
