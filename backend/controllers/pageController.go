package controllers

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
)

func Controller_Page_Post(w http.ResponseWriter, r *http.Request) {

}

func Controller_Page_Get(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	fmt.Println(id)

}
