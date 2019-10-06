package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"

	"github.com/gorilla/websocket"
)

var map_state MapState;

func main() {
	fmt.Printf("Hello world")

	init_map_data(&map_state)

	http.Handle("/", http.FileServer(http.Dir("./content")))
	http.HandleFunc("/gameSocket", clientSocket)
	log.Fatal(http.ListenAndServe(":8080", nil))
}

var upgrader = websocket.Upgrader{} // use default options
var nextPlayerId = 2
// var gameSocket *GameSocket

type PlayerConnectResponse struct {
	Type int `json:"type"`
	Player_id   int `json:"player_id"`
	Position Vec2i `json:"pos"`
}

func clientSocket(w http.ResponseWriter, r *http.Request) {
	c, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("upgrade:", err)
		return
	}
	
	response := PlayerConnectResponse {
		Type : 0,
		Player_id: nextPlayerId,
		Position : GetRandomEmptyPointInMap(&map_state),
	}
	
	msg, err := json.Marshal(response)
	os.Stdout.Write(msg)
	c.WriteMessage(websocket.TextMessage, msg)
	
	var client = &Client{
		playerId:   nextPlayerId,
		map_state: &map_state,
		// gameSocket: gameSocket,
		conn:       c,
		send:       make(chan []byte, 256)}
		
		// gameSocket.register <- client
		
	go client.readPump()
	go client.writePump()
	nextPlayerId += 1
}

func GetRandomEmptyPointInMap(map_state * MapState) Vec2i {
	var found_result = false;
	var result Vec2i

	map_state.Lock();
	for found_result == false {
		result.X = rand.Intn(map_width)
		result.Y = rand.Intn(map_height)

		var map_idx = (result.Y * map_width) + result.X
		if (map_state.data[map_idx] == 0) {
			found_result = true;
		}
	}
	map_state.Unlock();

	return result;
}