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
    this.players.forEach((player, index) => {
      player.boson.x = playerPositions[index].x
      player.boson.y = playerPositions[index].y
    })
  }

  frame() {
    // updates actual perceived game frame
    let now = Date.now()
    if (now >= this.next) {
      this.next = now + 100
      
      let playerPositions = []
      this.players.forEach(player => playerPositions.push({x: player.boson.x, y: player.boson.y}))
      
      const data = {
        type: "tickForward",
        playerPositions: playerPositions
      }
      this.api.transmit(data)
    }
  }
}
