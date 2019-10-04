package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	fmt.Printf("Hello world")

	http.Handle("/", http.FileServer(http.Dir("./content")))
	log.Fatal(http.ListenAndServe(":8080", nil))
}