package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	db "ProjectAlpha/DB"
	"ProjectAlpha/JSON"
	sess "ProjectAlpha/functions"
	"ProjectAlpha/models"

	"golang.org/x/crypto/bcrypt"

	"github.com/gorilla/sessions"
)

func Controller_Login(w http.ResponseWriter, r *http.Request) {
	var login models.LoginModel
	err := json.NewDecoder(r.Body).Decode(&login)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	userId, err := LoginUser(&login)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	//creating session
	sess.CreateSession(w, r, userId)
	JSON.SendJSON(w, "Login successful", "message")
}

func Controller_Logout(w http.ResponseWriter, r *http.Request) {
	session, _ := sess.Store.Get(r, "session")
	session.Options = &sessions.Options{
		MaxAge: -1,
	}
	err := session.Save(r, w)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	JSON.SendJSON(w, "Logout successful", "message")
}

func Controller_Register(w http.ResponseWriter, r *http.Request) {
	var register models.LoginModel
	err := json.NewDecoder(r.Body).Decode(&register)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	userId, err := RegisterUser(&register)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	//creating session
	sess.CreateSession(w, r, userId)
	JSON.SendJSON(w, "Register successful", "message")
}

func LoginUser(login *models.LoginModel) (int, error) {
	row := db.Context.QueryRow("SELECT id, password FROM Users where email=$1", login.Email)

	var hash string
	var user_id int
	err := row.Scan(&user_id, &hash)
	if err != nil {
		return 0, &models.LoginFailed{}
	}
	err = bcrypt.CompareHashAndPassword([]byte(hash), []byte(login.Password))
	if err != nil {
		return 0, &models.LoginFailed{}
	}
	return user_id, nil
}
func RegisterUser(register *models.LoginModel) (int, error) {
	//TODO: email verification
	row := db.Context.QueryRow("SELECT id FROM Users where email=$1", register.Email)
	var temp int
	err := row.Scan(&temp)
	if err == nil {
		return 0, fmt.Errorf("username taken")
	} else if err != sql.ErrNoRows {
		return 0, err
	}

	encryptedPW, err := bcrypt.GenerateFromPassword([]byte(register.Password), 8)
	if err != nil {
		return 0, err
	}
	_, err = db.Context.Exec("INSERT INTO users (Email,Password) values ($1,$2)", register.Email, string(encryptedPW))
	if err != nil {
		return 0, err
	}
	row = db.Context.QueryRow("SELECT id FROM Users where email=$1", register.Email)

	var user_id int
	err = row.Scan(&user_id)
	if err != nil {
		return 0, err
	}

	return user_id, nil
	//creating session
}
