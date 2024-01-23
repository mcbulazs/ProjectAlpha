package main

import (
	"fmt"
	"net/http"

	_ "github.com/lib/pq"
	db "github.com/mcbulazs/ProjectAlpha/DB"
	"github.com/mcbulazs/ProjectAlpha/controllers"
)

func main() {
	db.Init_db()
	defer db.Context.Close()

	http.HandleFunc("/users", controllers.Controller_Users)
	fmt.Println("Listening on port 3000 ...")
	http.ListenAndServe(":"+fmt.Sprint(3000), nil)

}
