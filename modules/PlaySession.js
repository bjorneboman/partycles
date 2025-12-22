export class PlaySession {
    constructor(atom, session = "", isHost = false) {
        this.session = session
        this.isHost = isHost
        this.players = [atom]

        this.next = 0
    }
    frame() {
        // updates frame
        let now = Date.now()
        if (now >= this.next) {
            this.next = now + 1000
            let data = []
            data.push(this.atom.x)
            data.push(this.atom.y)
            this.api.transmit(data)
        }

    }
}