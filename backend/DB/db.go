package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
)

var Context *sql.DB

func Init_db() {
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
	fmt.Println("Successfully connected to the database")
}
