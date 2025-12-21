export class Lobby {
    constructor() {

        this.lobbySection = document.querySelector("#lobby")
        this.btnHost = document.getElementById('btn-host');
        this.btnJoin = document.getElementById('btn-join');
        this.btnPing = document.getElementById('btn-ping');
        this.inputSession = document.getElementById('input-session-id');
        this.inputName = document.getElementById('input-name');
        this.displaySessionId = document.getElementById('display-session-id');
        this.sessionInfo = document.createElement("div")
        this.lobbySection.append(this.sessionInfo)
        
        
    }
    showStatusMessage(msg) {
        this.displaySessionId.textContent = msg
    }
    displaySessionInfo(sessionInfo) {
        this.sessionInfo.textContent = sessionInfo
    }

}