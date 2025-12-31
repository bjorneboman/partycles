import { Boson } from "../game-elements/Boson.js"
import { Photon } from "../game-elements/Photon.js"
import { Renderer } from "../game-elements/Renderer.js"
import { randomPhotonPosition } from "../utils/random.js"
import { PlaySession } from "./PlaySession.js"
import { resetHUD } from "../ui/hud.js"

export class Game {
  constructor(canvas, ctx, api) {
    this.playCounter = 0

    this.canvas = canvas
    this.ctx = ctx
    this.api = api

    this.gameLenghtInMS = 10000
    this.timeLeft = this.gameLenghtInMS
    this.startTime = null
    this.clockElement = document.querySelector("#clock")
    // this.timer = null

    this.bosonPresets = [
      {
        speed: 5,
        x: 100,
        y: 100,
        dir: { x: 1, y: 0 },
      },
      {
        speed: 5,
        x: 700,
        y: 500,
        dir: { x: -1, y: 0 },
      },
    ]

    this.photons = []

    this.renderer = new Renderer(ctx)

    this.isRunning = false
    this.rAF = null

    // handleInput(this.boson)
  }

  async host(lobby, playerName) {
    try {
      if (!playerName || playerName === "" || typeof playerName !== String)
        playerName = "Host"

      const response = await this.api.host({
        name: playerName,
        playerName: playerName,
      })

      const clientId = response.clientId
      this.playSession = new PlaySession(
        true,
        this.api,
        clientId,
        playerName,
        false
      )

      lobby.showStatusMessage(
        `You are hosting session ${response.session} as "${playerName}"`
      )

      lobby.enableReadyButton()
    } catch (err) {
      console.log(`Error hosting: ${err}`)
    }
  }

  async join(lobby, sessionId, playerName) {
    try {
      // .join() returns a Promise
      if (!playerName || playerName === "" || typeof playerName !== String)
        playerName = "Anominonouminous"
      const response = await this.api.join(sessionId, {
        playerName: playerName,
      })
      this.playSession = new PlaySession( // sätt först in host med hostId som clientId i players-arrayen
        false,
        this.api,
        response.clientId,
        playerName,
        false
      )

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

  initPhotons() {
    let photons = []
    for (let i = 0; i < 5; i++) {
      const { x, y } = randomPhotonPosition(this.canvas)
      photons.push(new Photon(x, y))
    }
    return photons
  }

  start(firstPhotons) {
    this.playCounter++
    console.log("Game nr", this.playCounter, "started")
    this.startTime = Date.now()
    // Pre-spawn photons
    for (let i = 0; i < 5; i++) {
      this.photons[i] = new Photon(firstPhotons[i].x, firstPhotons[i].y)
    }

    // Reset game data
    cancelAnimationFrame(this.rAF)

    // resetHUD(this.hostPlaySession.players)

    this.timeLeft = this.gameLenghtInMS
    this.clockElement.textContent = this.timeLeft

    this.playSession.players.forEach((player, index) => {
      if (!(player.boson instanceof Boson)) {
        player.boson = new Boson(this.bosonPresets[index])
      } else {
        player.boson.x = this.bosonPresets[index].x
        player.boson.y = this.bosonPresets[index].y
        player.boson.dir = this.bosonPresets[index].dir
      }
      player.boson.trail.reset(
        this.bosonPresets[index].x,
        this.bosonPresets[index].y
      )
    })

    this.isRunning = true
    this.loop()
  }

  gameClock(now) {
    if (this.timeLeft <= 0) {
      this.isRunning = false
      this.gameOver()
    } else {
      this.timeLeft = this.gameLenghtInMS - (now - this.startTime)
      this.clockElement.textContent = this.timeLeft
    }
  }

  loop() {
    this.update(this.isRunning)
    this.render()
    this.gameClock(Date.now())
    if (this.playSession.isHost) this.playSession.frame()
    this.rAF = requestAnimationFrame(() => this.loop())
  }

  // NOTE: Handles everything that happens every AnimationFrame, e.g.graphics updates and collisions occuring inbetween game ticks
  update(isRunning) {
    this.playSession.players[0].boson.update(isRunning)

    if (isRunning && this.playSession.isHost) {
      // Foton-kollisioner
      // for (let i = 0; i < this.photons.length; i++) {
      // const p = this.photons[i]

      this.photons.forEach((photon, photonIndex) => {
        // Check for collisions
        if (this.playSession.players[0].boson.collidesWithPhoton(photon)) {
          // Remove photon from array
          this.photons.splice(photonIndex, 1)

          // Spawn new photon
          const { x, y } = randomPhotonPosition(this.canvas)
          this.photons.push(new Photon(x, y))

          // Reference absorbant boson
          const playerIndex = 0

          // Send update to clients
          this.api.transmit({
            type: "photonAbsorbtion",
            playerIndex: playerIndex,
            photons: this.photons,
          })
        }
      })

      // Kollisioner med vägg
      if (this.playSession.players[0].boson.collidesWithWall(this.canvas))
        this.annihilation(this.playSession.players[0].boson)

      // TODO: Kollisioner med egen svans
    }
  }
  annihilation(boson) {
    boson.annihilateAndRespawn()
  }

  gameOver() {
    this.clockElement.textContent = "GAME OVER"
    this.photons = []
    console.log("Game nr", this.playCounter, " as it has been... is over")
  }

  tickForward(playerPositions) {
    this.playSession.handleTick(playerPositions)
    // this.render()
  }
  render() {
    this.renderer.clear(this.canvas)

    if (this.isRunning) {
      this.photons.forEach((p) => {
        p.draw(this.renderer)
      })
    }

    this.playSession.players[0].boson.draw(this.renderer, this.isRunning)
  }
}
