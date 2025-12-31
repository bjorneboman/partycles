export class Lobby {
    constructor() {

        this.lobbySection = document.querySelector("#lobby")
        this.btnHost = document.getElementById('btn-host');
        this.btnJoin = document.getElementById('btn-join');
        this.btnReady = document.getElementById('btn-ready');
        this.inputSession = document.getElementById('input-session-id');
        this.inputName = document.getElementById('input-name');
        this.statusMessage = document.getElementById('status-message');
        
        this.btnReady.setAttribute("disabled", "true")        
    }
    showStatusMessage(msg) {
        this.statusMessage.textContent = msg
    }
    enableReadyButton() {
        this.btnReady.removeAttribute("disabled")
        // this.btnReady.setAttribute("disabled", "false")
    }

}