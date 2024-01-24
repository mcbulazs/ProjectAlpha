package main

import (
	"fmt"
	"net/http"

	db "ProjectAlpha/DB"
	"ProjectAlpha/controllers"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
)

func main() {
	db.Init_db()
	defer db.Context.Close()

	r := mux.NewRouter()
	controllers.ControllerInit(r)
	http.Handle("/", r)
	fmt.Println("Listening on port 3000 ...")

	http.ListenAndServe(":3000", nil)
}
