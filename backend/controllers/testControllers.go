package controllers

import (
	db "ProjectAlpha/DB"
	"ProjectAlpha/JSON"
	"fmt"
	"net/http"
)

func Controller_Test(w http.ResponseWriter, r *http.Request) {
	fmt.Println("test")
	_, commitOrRollback, err := db.BeginTransaction()
	if err != nil {
		fmt.Print(err.Error())
		return
	}
	defer commitOrRollback(&err)

	err = fmt.Errorf("csa")
	JSON.SendJSON(w, "no error in test", "message")
}
