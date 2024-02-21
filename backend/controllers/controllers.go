package controllers

import (
	"ProjectAlpha/middleware"

	"github.com/gorilla/mux"
)

func ControllerInit(r *mux.Router) {
	r.Use(middleware.LoggingMiddleware)
	r.Use(middleware.OptionsMiddleware)
	//user controllers
	r.HandleFunc("/login", Controller_Login).Methods("POST", "OPTIONS")
	r.HandleFunc("/register", Controller_Register).Methods("POST", "OPTIONS")
	r.HandleFunc("/logout", Controller_Logout).Methods("GET", "OPTIONS")
	r.HandleFunc("/testing", Controller_Test).Methods("GET", "OPTIONS")
	r.HandleFunc("/auth", Controller_Auth).Methods("GET", "OPTIONS")

	//outer webpage get
	r.HandleFunc("/", Controller_Outer_Page_Get).Methods("GET")
	r.PathPrefix("/files").HandlerFunc(Controller_Outer_File_Serve).Methods("GET")

	//webpage controllers
	pageRouter := r.PathPrefix("/page/{webId:[0-9]+}").Subrouter()
	pageRouter.Use(middleware.CheckWebpageMiddleware)
	pageRouter.Use(middleware.SessionMiddleware)
	pageRouter.HandleFunc("", Controller_Page).Methods("GET", "PATCH", "OPTIONS")

	pageRouter.HandleFunc("/files", Controller_File_Save).Methods("POST", "OPTIONS")
	pageRouter.HandleFunc("/files/articles", Controller_Article_File_Save).Methods("POST", "OPTIONS")
	pageRouter.PathPrefix("/files").HandlerFunc(Controller_File_Serve).Methods("GET", "OPTIONS", "DELETE")

	pageRouter.HandleFunc("/articles", Controller_Page_Articles_Save).Methods("POST", "OPTIONS")
	pageRouter.HandleFunc("/articles/{Id:[0-9]+}", Controller_Page_Articles_Modify).Methods("PATCH", "DELETE", "OPTIONS")

	pageRouter.HandleFunc("/recruitment", Controller_Page_Recruitment_Save).Methods("POST", "OPTIONS")
	pageRouter.HandleFunc("/recruitment/{Id:[0-9]+}", Controller_Page_Recruitment_Modify).Methods("PATCH", "DELETE", "OPTIONS")

	pageRouter.HandleFunc("/navbar", Controller_Page_Navbar_Modify).Methods("PATCH", "OPTIONS")

	pageRouter.HandleFunc("/channels", Controller_Page_Channel_Save).Methods("POST", "OPTIONS")
	pageRouter.HandleFunc("/channels/{Id:[0-9]+}", Controller_Page_Channel_Modify).Methods("PATCH", "DELETE", "OPTIONS")

	pageRouter.HandleFunc("/progress", Controller_Page_Progress_Save).Methods("POST", "OPTIONS")
	pageRouter.HandleFunc("/progress/{Id:[0-9]+}", Controller_Page_Progress_Modify).Methods("PATCH", "DELETE", "OPTIONS")

	pageRouter.HandleFunc("/calendar", Controller_Page_Calendar_Save).Methods("POST", "OPTIONS")
	pageRouter.HandleFunc("/calendar/{Id:[0-9]+}", Controller_Page_Calendar_Modify).Methods("PATCH", "DELETE", "OPTIONS")

	//pageRouter.HandleFunc("/rules", Controller_Page_Rules).Methods("POST", "PATCH", "DELETE", "OPTIONS")

}
