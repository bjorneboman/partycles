import { Boson } from "../game-elements/Boson.js"
import { Photon } from "../game-elements/Photon.js"
import { Renderer } from "../game-elements/Renderer.js"
import { randomPhotonPosition } from "../utils/random.js"
import { PlaySession } from "./PlaySession.js"
import { resetHUD } from "../ui/hud.js"

export class Game {
  constructor(canvas, ctx, api) {
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

      this.playSession = new PlaySession(
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
      photons.push({ x, y })
    }
    return photons
  }

  start(firstPhotons) {
    console.log("Game started")
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

    // Reposition Bosons, set directions and reset Bosonic energy trails
    // if (this.hostPlaySession) {
    //   this.hostPlaySession.players.forEach((player, index) => {
    //     if (!player.boson) player.boson = new Boson(this.bosonPresets[index])
    //     player.boson.x = this.bosonPresets[index].x
    //     player.boson.y = this.bosonPresets[index].y
    //     player.boson.dir = this.bosonPresets[index].dir
    //     player.boson.trail.reset(player.boson.x, player.boson.y)
    //   })
    // } else {
    this.playSession.players.forEach((player, index) => {
      if (!player.boson) player.boson = new Boson(this.bosonPresets[index])
      else {
        player.boson.x = this.bosonPresets[index].x
        player.boson.y = this.bosonPresets[index].y
        player.boson.dir = this.bosonPresets[index].dir
      } 
     player.boson.trail.reset(player.boson.x, player.boson.y)
    })
    // }
    this.isRunning = true
    // this.timer = setInterval(() => {
    //   this.gameClock()
    // }, 1000)
    this.loop()
  }

  gameClock(now) {
    if (this.timeLeft <= 0) {
      this.isRunning = false
      // clearInterval(this.timer)
      this.gameOver()
    } else {
      //   this.timeLeft -= 1
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

  // NOTE: Updates everything that happens every AnimationFrame, not hostPlaySession.frame!
  update(isRunning) {
    this.playSession.players[0].boson.update(isRunning)

    if (isRunning) {
      // Foton-kollisioner
      for (let i = 0; i < this.photons.length; i++) {
        const p = this.photons[i]
        if (this.playSession.players[0].boson.collidesWithPhoton(p)) {
          this.photons.splice(i, 1)
          this.playSession.players[0].boson.extend()

          // Spawn ny foton
          const { x, y } = randomPhotonPosition(this.canvas)
          this.photons.push(new Photon(x, y))
        }
      }

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
  }

  tickForward(playerPositions) {
    this.playSession.handleTick(playerPositions)
    // this.render()
  }
  render() {
    this.renderer.clear(this.canvas)

    if (this.isRunning) this.photons.forEach((p) => p.draw(this.renderer))

    this.playSession.players[0].boson.draw(this.renderer, this.isRunning)
  }
}
