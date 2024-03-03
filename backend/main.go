package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"

	db "ProjectAlpha/DB"
	"ProjectAlpha/controllers"
)

func main() {
	db.Init_db()
	defer db.Context.Close()

	r := mux.NewRouter()
	controllers.ControllerInit(r)
	http.Handle("/", r)
	fmt.Println("Listening on port 3000 ...")

	err := http.ListenAndServe(":3000", nil)
	if err != nil {
		fmt.Println(err.Error())
	}
}
