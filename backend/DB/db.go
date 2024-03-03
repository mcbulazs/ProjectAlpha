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
	dbUser := os.Getenv("DB_USER")         // admin
	dbPassword := os.Getenv("DB_PASSWORD") // Admin123
	dbName := os.Getenv("DB_NAME")         // PSQL
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

func BeginTransaction() (*sql.Tx, func(*error), error) {
	tx, err := Context.Begin()
	if err != nil {
		return nil, nil, err
	}

	commitOrRollback := func(errPtr *error) {
		// Defer a function to check for errors and commit or rollback accordingly
		if *errPtr != nil {
			// An error occurred, rollback the transaction
			fmt.Println("Rolling back transaction due to error:", *errPtr)
			err = tx.Rollback()
			if err != nil {
				fmt.Println("Error rolling back transaction:", err)
			}
		} else {
			// No errors, commit the transaction
			err := tx.Commit()
			if err != nil {
				fmt.Println("Error committing transaction:", err)
				*errPtr = err
			}
		}
	}

	return tx, commitOrRollback, nil
}
