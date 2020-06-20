// GameServer
package main

import (
// 	"log"
// 	"net/http"
	"time"

// 	"github.com/gorilla/websocket"
)

const (
	update_time = 500 * time.Millisecond
)

type GameState struct {
	map_state MapState
	players map[int]*Client
}

func (g * GameState) ProcessPlayers() {
	for {
		var start_time = time.Now()

		for k := range g.players {
			g.players[k].Lock()
			
			g.players[k].Unlock()
		}

		// sleep the go routine 
		var end_time = time.Now()
		var time_diff = end_time.Sub(start_time)
		if (time_diff < update_time) {
			time.Sleep(update_time - time_diff)
		}
	}
}