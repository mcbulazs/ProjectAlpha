package controllers

import (
	"ProjectAlpha/functions"
	"ProjectAlpha/middleware"
	"net/http"

	"github.com/gorilla/mux"
)

func ControllerInit(r *mux.Router) {
	functions.Init_allowed_origins()
	r.Use(middleware.SessionMiddleware)
	//user controllers
	r.HandleFunc("/login", Controller_Login).Methods("POST", "OPTIONS")
	r.HandleFunc("/register", Controller_Register).Methods("POST", "OPTIONS")
	r.HandleFunc("/logout", Controller_Logout).Methods("GET")

	r.HandleFunc("/auth", func(w http.ResponseWriter, r *http.Request) { w.Write(nil) }).Methods("GET")

	//webpage controllers
	pageRouter := r.PathPrefix("/page").Subrouter()
	pageRouter.Use(middleware.CheckWebpageMiddleware)
	pageRouter.HandleFunc("/{id:[0-9]+}", Controller_Page_Post).Methods("POST")
	pageRouter.HandleFunc("/{id:[0-9]+}", Controller_Page_Get).Methods("GET")
}
