export class PlaySession {
  constructor(
    // boson,
    isHost = false,
    api,
    clientId,
    playerName,
    isReady = false
  ) {
    this.players = [
      {
        // boson: boson,
        clientId: clientId,
        playerName: playerName,
        isReady: isReady
      },
    ]
    this.isHost = isHost
    this.api = api
    this.next = 0
  }
  handleTick(playerPositions) {
    this.players[0].boson.x = playerPositions[0].x
    this.players[0].boson.y = playerPositions[0].y
  }
  frame() {
    // updates actual perceived game frame
    let now = Date.now()
    if (now >= this.next) {
      this.next = now + 1000
      let playerPositions = []
      playerPositions.push({x: this.players[0].boson.x, y: this.players[0].boson.y })
      const data = {
        type: "tickForward",
        playerPositions: playerPositions
      }
      this.api.transmit(data)
    }
  }
}
