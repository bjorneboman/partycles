export class Lobby {
    constructor() {

        this.lobbySection = document.querySelector("#lobby")
        this.btnHost = document.getElementById('btn-host');
        this.btnJoin = document.getElementById('btn-join');
        this.btnReady = document.getElementById('btn-ready');
        this.inputSession = document.getElementById('input-session-id');
        this.inputName = document.getElementById('input-name');
        this.statusMessage = document.getElementById('status-message');
        this.sessionInfo = document.createElement("div")
        this.lobbySection.append(this.sessionInfo)
        
        this.btnReady.setAttribute("disabled", "true")        
    }
    showStatusMessage(msg) {
        this.statusMessage.textContent = msg
    }
    displaySessionInfo(sessionInfo) {
        this.sessionInfo.textContent = sessionInfo
    }
    enableReadyButton() {
        this.btnReady.removeAttribute("disabled")
        // this.btnReady.setAttribute("disabled", "false")
    }

}