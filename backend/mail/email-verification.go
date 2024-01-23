package main

import (
	"fmt"
	"log"
	"net/smtp"

	"net/http"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
)

// User represents a user account
type User struct {
	ID             string
	Email          string
	IsVerified     bool
	VerificationID string
}

var users = make(map[string]User)

func TestMain() {
	r := mux.NewRouter()

	r.HandleFunc("/signup", signupHandler).Methods("POST")
	r.HandleFunc("/verify/{id}", verifyHandler).Methods("GET")

	http.Handle("/", r)

	log.Fatal(http.ListenAndServe(":8080", nil))
}

func signupHandler(w http.ResponseWriter, r *http.Request) {
	email := r.FormValue("email")

	// Generate a unique verification ID
	verificationID := uuid.New().String()

	// Create a user and store the verification ID
	user := User{
		ID:             uuid.New().String(),
		Email:          email,
		IsVerified:     false,
		VerificationID: verificationID,
	}
	users[user.ID] = user

	// Send a verification email
	err := sendVerificationEmail(email, verificationID)
	if err != nil {
		http.Error(w, "Error sending verification email", http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, "Verification email sent to %s", email)
}

func verifyHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	verificationID := vars["id"]

	// Find the user with the given verification ID
	var user User
	for _, u := range users {
		if u.VerificationID == verificationID {
			user = u
			break
		}
	}

	if user.ID == "" {
		http.Error(w, "Invalid verification link", http.StatusBadRequest)
		return
	}

	// Update the user's account status to verified
	user.IsVerified = true
	users[user.ID] = user

	fmt.Fprintf(w, "Email verification successful for %s", user.Email)
}

func sendVerificationEmail(email, verificationID string) error {
	// TODO: Replace with your email sending logic
	// For simplicity, this example uses a local SMTP server. In a production environment, use a proper email sending service.
	auth := smtp.PlainAuth("", "your-email@gmail.com", "your-password", "smtp.gmail.com")

	msg := fmt.Sprintf("Click the following link to verify your email: http://localhost:8080/verify/%s", verificationID)

	err := smtp.SendMail("smtp.gmail.com:587", auth, "your-email@gmail.com", []string{email}, []byte(msg))
	if err != nil {
		return err
	}

	return nil
}
