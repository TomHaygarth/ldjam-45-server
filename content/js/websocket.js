var socket = new WebSocket("ws://" + location.host + "/gameSocket");

function OnGameMsgRecv(msg) {
	var msgType = msg.type;
	
	//inser switch statement for parsing game types
	if (msgType === 0) {
		OnInitialConnection(msg);
	} else if (msgType === 1) {
		OnGameStateRecv(msg);
	}
}

function OnInitialConnection(msg) {
    player.player_id = msg.player_id;
    player.pos = msg.pos;
    player.rotate = true;
}

function OnGameStateRecv(msg) {
}

function SendPlayerInfo(player) {
    socket.send(JSON.stringify(player));
}


socket.onmessage = function (event) {
	console.log(JSON.parse(event.data));
	OnGameMsgRecv(JSON.parse(event.data));
};