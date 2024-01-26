package controllers

import (
	"ProjectAlpha/functions"
	"ProjectAlpha/middleware"

	"github.com/gorilla/mux"
)

func ControllerInit(r *mux.Router) {
	functions.Init_allowed_origins()
	r.Use(middleware.SessionMiddleware)
	r.Use(middleware.OptionsMiddleware)
	//user controllers
	r.HandleFunc("/login", Controller_Login).Methods("POST", "OPTIONS")
	r.HandleFunc("/register", Controller_Register).Methods("POST", "OPTIONS")
	r.HandleFunc("/logout", Controller_Logout).Methods("GET")

	r.HandleFunc("/auth", Controller_Auth).Methods("GET")

	//webpage controllers
	pageRouter := r.PathPrefix("/page/{webId:[0-9]+}").Subrouter()
	pageRouter.Use(middleware.CheckWebpageMiddleware)
	pageRouter.HandleFunc("", Controller_Page_Get).Methods("GET")
	pageRouter.HandleFunc("/articles", Controller_Page_Articles_Save).Methods("POST", "OPTIONS")
	pageRouter.HandleFunc("/articles/{Id:[0-9]+}", Controller_Page_Articles_Modify).Methods("PATCH", "DELETE", "OPTIONS")

}
