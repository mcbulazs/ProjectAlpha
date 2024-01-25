package controllers

import (
	"ProjectAlpha/JSON"
	"ProjectAlpha/functions/page"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

func Controller_Page_Post(w http.ResponseWriter, r *http.Request) {

}

func Controller_Page_Get(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	fmt.Println(id)
	result, err := page.GetWebContent(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	JSON.SendJSON(w, result)
}
