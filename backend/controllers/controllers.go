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
	r.HandleFunc("/logout", Controller_Logout).Methods("GET", "OPTIONS")
	r.HandleFunc("/testing", Controller_Test).Methods("GET", "OPTIONS")
	r.HandleFunc("/auth", Controller_Auth).Methods("GET", "OPTIONS")

	//outer webpage get
	r.HandleFunc("/page", Controller_Page_Get)

	//webpage controllers
	pageRouter := r.PathPrefix("/page/{webId:[0-9]+}").Subrouter()
	pageRouter.Use(middleware.CheckWebpageMiddleware)
	pageRouter.HandleFunc("", Controller_Page).Methods("GET", "PATCH", "OPTIONS")

	pageRouter.HandleFunc("/files", Controller_File_Save).Methods("POST", "OPTIONS")
	pageRouter.PathPrefix("/files").HandlerFunc(Controller_File_Serve).Methods("GET")

	pageRouter.HandleFunc("/articles", Controller_Page_Articles_Save).Methods("POST", "OPTIONS")
	pageRouter.HandleFunc("/articles/{Id:[0-9]+}", Controller_Page_Articles_Modify).Methods("PATCH", "DELETE", "OPTIONS")

	pageRouter.HandleFunc("/recruitment", Controller_Page_Recruitment_Save).Methods("POST", "OPTIONS")
	pageRouter.HandleFunc("/recruitment/{Id:[0-9]+}", Controller_Page_Recruitment_Modify).Methods("PATCH", "DELETE", "OPTIONS")

	pageRouter.HandleFunc("/navbar", Controller_Page_Navbar_Modify).Methods("PATCH", "OPTIONS")

	pageRouter.HandleFunc("/youtube", Controller_Page_Youtube_Save).Methods("POST", "OPTIONS")
	pageRouter.HandleFunc("/youtube/{Id:[0-9]+}", Controller_Page_Youtube_Modify).Methods("PATCH", "DELETE", "OPTIONS")

	pageRouter.HandleFunc("/twitch", Controller_Page_Twitch_Save).Methods("POST", "OPTIONS")
	pageRouter.HandleFunc("/twitch/{Id:[0-9]+}", Controller_Page_Twitch_Modify).Methods("PATCH", "DELETE", "OPTIONS")

	pageRouter.HandleFunc("/progress", Controller_Page_Progress_Save).Methods("POST", "OPTIONS")
	pageRouter.HandleFunc("/progress/{Id:[0-9]+}", Controller_Page_Twitch_Modify).Methods("PATCH", "DELETE", "OPTIONS")

	pageRouter.HandleFunc("/calendar", Controller_Page_Calendar_Save).Methods("POST", "OPTIONS")
	pageRouter.HandleFunc("/calendar/{Id:[0-9]+}", Controller_Page_Calendar_Modify).Methods("PATCH", "DELETE", "OPTIONS")

	pageRouter.HandleFunc("/rules", Controller_Page_Rules_Save).Methods("POST", "OPTIONS")
	pageRouter.HandleFunc("/rules/{Id:[0-9]+}", Controller_Page_Rules_Modify).Methods("PATCH", "DELETE", "OPTIONS")

}
