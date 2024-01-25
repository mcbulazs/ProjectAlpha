package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"net/mail"

	db "ProjectAlpha/DB"
	"ProjectAlpha/JSON"
	sess "ProjectAlpha/functions"
	"ProjectAlpha/models"

	"golang.org/x/crypto/bcrypt"

	"github.com/gorilla/sessions"
)

func Controller_Login(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		{
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
	case http.MethodOptions:
		{
			w.Header().Set("Allow", "POST")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		}
	}
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
	// Switchbe raktam a kérések kezelését, mivel szükség volt OPTIONS kérés kezelésére.
	// POST kérések előtt küld a böngésző egy preflight kérést OPTIONS metódussal, amely előbb lekérdezi mit szabad
	// Majd általánosítod, mert minden POST-hoz fog kelleni
	switch r.Method {
	case http.MethodPost:
		{
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
	case http.MethodOptions:
		{
			w.Header().Set("Allow", "POST")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		}
	}
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
func checkRegisterValidity(register *models.LoginModel) error {
	_, err := mail.ParseAddress(register.Email)
	if err != nil {
		return err
	}
	if len(register.Password) < 8 {
		return fmt.Errorf("invalid password format")
	}
	return nil
}

func RegisterUser(register *models.LoginModel) (int, error) {
	//TODO: email verification
	err := checkRegisterValidity(register)
	if err != nil {
		return 0, err
	}
	row := db.Context.QueryRow("SELECT id FROM Users where email=$1", register.Email)
	var temp int
	err = row.Scan(&temp)
	if err == nil {
		return 0, fmt.Errorf("username taken")
	} else if err != sql.ErrNoRows {
		return 0, err
	}

	encryptedPW, err := bcrypt.GenerateFromPassword([]byte(register.Password), 8)
	if err != nil {
		return 0, err
	}
	var user_id int
	err = db.Context.QueryRow("INSERT INTO users (Email,Password) values ($1,$2) RETURNING  Id", register.Email, string(encryptedPW)).Scan(&user_id)
	if err != nil {
		return 0, err
	}
	if err != nil {
		return 0, err
	}

	return user_id, nil
	//creating session
}
