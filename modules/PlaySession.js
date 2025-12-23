export class PlaySession {
    constructor(boson, session = "", isHost = false, api) {
        this.players = [boson]
        this.session = session
        this.isHost = isHost
        this.api = api
        this.next = 0
    }
    frame() {
        // updates frame
        let now = Date.now()
        if (now >= this.next) {
            this.next = now + 1000
            let data = []
            data.push(this.players[0].x)
            data.push(this.players[0].y)
            this.api.transmit(data)
        }

    }
}