import { Boson } from "../game-elements/Boson.js"
import { Photon } from "../game-elements/Photon.js"
import { handleInput } from "../ui/Input.js"
import { Renderer } from "../game-elements/Renderer.js"
import { randomPhotonPosition } from "../utils/random.js"
import { PlaySession } from "./PlaySession.js"
import { resetHUD } from "../ui/hud.js"

export class Game {
  constructor(canvas, ctx, api) {
    this.canvas = canvas
    this.ctx = ctx
    this.api = api

    this.gameLenghtInSeconds = 10
    this.timeLeft = this.gameLenghtInSeconds
    this.clockElement = document.querySelector("#clock")
    this.timer = null

    this.bosonPresets = [
      {
        speed: 5,
        x: 100,
        y: 100,
        dir: { x: 1, y: 0 },
        radius: 10,
      },
    ]

    this.boson = new Boson(100, 100)
    this.photons = []

    this.renderer = new Renderer(ctx)

    this.isRunning = false
    this.rAF = null

    handleInput(this.boson)
  }

  async host(lobby, playerName) {
    try {
      // .host() returns a Promise that gives us the session details
      if (!playerName || playerName === "" || typeof(playerName) !== String) playerName = "Host"

      const response = await this.api.host({ name: playerName, playerName: playerName})

      // const clientId = response.clientId
      this.playSession = new PlaySession(this.boson, null, true, this.api)
      console.log("Session created successfully!")

      lobby.showStatusMessage(
        `You are hosting session ${response.session} as "${playerName}"`
      )

      lobby.enableReadyButton()
      // updateSessionInfo()
    } catch (err) {
      console.log(`Error hosting: ${err}`)
    }
  }
  
  async join(lobby, sessionId, playerName) {
    try {
      // .join() returns a Promise
      const response = await this.api.join(sessionId, {
        playerName: playerName ? playerName : "Anominonouminous",
      })
      
      // this.playSession.players.push({clientId: response.clientId, playerName: playerName})
      console.log(response)
      
      lobby.showStatusMessage(
        `You are currently in session ${sessionId} as "${playerName}"`
      )

      lobby.enableReadyButton()
      // updateSessionInfo()
    } catch (err) {
      console.log(`Error joining: ${err}`)
      alert("Could not join. Check the console or ensure the ID is correct.")
    }
  }

  ready() {
    const message = { isReady: true }
    this.api.transmit(message)
  }

  start() {
    // 
    // Pre-spawn photons
    for (let i = 0; i < 5; i++) {
      const { x, y } = randomPhotonPosition(this.canvas)
      this.photons.push(new Photon(x, y))
    }

    // Reset game data
    cancelAnimationFrame(this.rAF)

    resetHUD(this.playSession.players)

    this.timeLeft = this.gameLenghtInSeconds
    this.clockElement.textContent = this.timeLeft

    // Reposition Bosons, set directions and reset Bosonic energy trails
    this.playSession.players.forEach((player, index) => {
      player.x = this.bosonPresets[index].x
      player.y = this.bosonPresets[index].y
      player.dir = this.bosonPresets[index].dir
      this.boson.trail.reset(player.x, player.y)
    })

    this.isRunning = true
    this.loop()
    this.timer = setInterval(() => {
      this.gameClock()
    }, 1000)
  }

  gameClock() {
    if (this.timeLeft <= 0) {
      this.isRunning = false
      clearInterval(this.timer)
      this.gameOver()
    } else {
      this.clockElement.textContent = this.timeLeft
      this.timeLeft -= 1
    }
  }

  loop() {
    this.update(this.isRunning)
    this.render()
    this.playSession.frame()
    this.rAF = requestAnimationFrame(() => this.loop())
  }

  update(isRunning) {
    this.boson.update(isRunning)

    if (isRunning) {
      // Foton-kollisioner
      for (let i = 0; i < this.photons.length; i++) {
        const p = this.photons[i]
        if (this.boson.collidesWithPhoton(p)) {
          this.photons.splice(i, 1)
          this.boson.extend()

          // Spawn ny foton
          const { x, y } = randomPhotonPosition(this.canvas)
          this.photons.push(new Photon(x, y))
        }
      }

      // Kollisioner med vägg
      if (this.boson.collidesWithWall(this.canvas))
        this.annihilation(this.boson)

      // TODO: Kollisioner med egen svans
    }
  }
  annihilation(boson) {
    boson.annihilateAndRespawn()
  }

  gameOver() {
    this.clockElement.textContent = "GAME OVER"
    this.photons = []
  }

  render() {
    this.renderer.clear(this.canvas)
    if (this.isRunning) this.photons.forEach((p) => p.draw(this.renderer))
    this.boson.draw(this.renderer, this.isRunning)
  }
}
