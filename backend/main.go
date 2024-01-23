package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

var Context *sql.DB

func init_db() {
	// Retrieve database credentials from environment variables
	dbUser := os.Getenv("DB_USER")         //admin
	dbPassword := os.Getenv("DB_PASSWORD") //Admin123
	dbName := os.Getenv("DB_NAME")         //PSQL
	connStr := fmt.Sprintf("user=%s dbname=%s password=%s host=postgres sslmode=disable", dbUser, dbName, dbPassword)
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}

	// Check if the connection to the database is successful
	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}
	Context = db
	encryptedPassword, err := bcrypt.GenerateFromPassword([]byte("Admin123"), 8)
	if err != nil {
		log.Fatal(err)
	}
	_, err = Context.Exec("INSERT INTO Users VALUES (default,default,'admin', '', $1)", string(encryptedPassword))
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Successfully connected to the database")
}

func main() {
	init_db()
	defer Context.Close()

	http.HandleFunc("/users", Controller_Users)
	fmt.Println("Listening on port 3000 ...")
	http.ListenAndServe(":"+fmt.Sprint(3000), nil)

}
