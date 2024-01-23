package controllers

import (
	"fmt"
	"net/http"

	db "github.com/mcbulazs/ProjectAlpha/DB"
	"github.com/mcbulazs/ProjectAlpha/JSON"
	"github.com/mcbulazs/ProjectAlpha/models"
	"golang.org/x/crypto/bcrypt"
)

func Controller_Users(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		result, err := GetAllUsers()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		JSON.SendJSON(w, result, "users")

	case http.MethodPost:
		r.ParseMultipartForm(0)
		err := AddUser(r.PostForm.Get("username"), r.PostForm.Get("email"), r.PostForm.Get("password"))
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}

	}
}

func GetAllUsers() ([]models.UserModel, error) {
	rows, err := db.Context.Query("SELECT id, username FROM Users")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	result := make([]models.UserModel, 0)

	var user models.UserModel
	for rows.Next() {
		err := rows.Scan(&user.Id, &user.Username)
		if err != nil {
			return nil, err
		}
		result = append(result, user)
	}
	fmt.Println(result)
	return result, nil
}
func AddUser(username string, email string, password string) error {
	encryptedPassword, err := bcrypt.GenerateFromPassword([]byte(password), 8)
	if err != nil {
		return err
	}
	_, err = db.Context.Exec("INSERT INTO Users VALUES (default,default,$1, $2, $3)", username, email, string(encryptedPassword))
	fmt.Println(err)
	if err != nil {
		return err
	}
	return nil
}
