package main

import (
	"fmt"
	"net/http"

	"golang.org/x/crypto/bcrypt"
)

func Controller_Users(w http.ResponseWriter, r *http.Request) {
	//_, _ = ProcessSession(w, r)
	switch r.Method {
	case http.MethodGet:
		result, err := GetAllUsers()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		SendJSON(w, result, nil, "users")
	case http.MethodPost:
		r.ParseMultipartForm(0)
		err := AddUser(r.PostForm.Get("username"), r.PostForm.Get("email"), r.PostForm.Get("password"))
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}

	}
}

type User struct {
	Id       int    ``
	Username string ``
	Email    string ``
	Password string ``
}

func GetAllUsers() ([]User, error) {
	rows, err := Context.Query("SELECT * FROM Users")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	result := make([]User, 0)

	var user User
	for rows.Next() {
		rows.Scan(&user.Id, &user.Username)
		result = append(result, user)
	}
	return result, nil
}
func AddUser(username string, email string, password string) error {
	encryptedPassword, err := bcrypt.GenerateFromPassword([]byte(password), 8)
	if err != nil {
		return err
	}
	_, err = Context.Exec("INSERT INTO Users VALUES (default,default,$1, $2, $3)", username, email, string(encryptedPassword))
	fmt.Println(err)
	if err != nil {
		return err
	}
	return nil
}
