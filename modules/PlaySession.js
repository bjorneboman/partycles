export class PlaySession {
    constructor(session = "", isHost = false) {
        this.session = session
        this.isHost = isHost
        this.players = []
    }
}