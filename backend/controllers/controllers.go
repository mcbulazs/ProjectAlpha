package controllers

import (
	"ProjectAlpha/functions"

	"github.com/gorilla/mux"
)

func ControllerInit(r *mux.Router) {
	functions.Init_allowed_origins()
	r.Use(functions.SessionMiddleware)
	r.HandleFunc("/login", Controller_Login).Methods("POST")
	r.HandleFunc("/register", Controller_Register).Methods("POST")
	r.HandleFunc("/logout", Controller_Logout).Methods("GET")
}
