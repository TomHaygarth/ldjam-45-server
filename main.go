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
var nextPlayerId uint32 = 2
// var gameSocket *GameSocket

type PlayerConnectResponse struct {
	Type uint8 `json:"type"`
	Player_id  uint32 `json:"player_id"`
	Position Vec2u8 `json:"pos"`
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
		// gameSocket: gameSocket,
		conn:       c,
		send:       make(chan []byte, 256)}
		
		// gameSocket.register <- client
		
	go client.readPump()
	go client.writePump()
	nextPlayerId += 1
}

func GetRandomEmptyPointInMap(map_state * MapState) Vec2u8 {
	var found_result = false;
	var result Vec2u8

	map_state.Lock();
	for found_result == false {
		result.X = uint8(rand.Intn(int(map_width)))
		result.Y = uint8(rand.Intn(int(map_height)))

		var map_idx = (uint16(result.Y) * map_width) + uint16(result.X)
		if (map_state.data[map_idx] == 0) {
			found_result = true;
		}
	}
	map_state.Unlock();

	return result;
}