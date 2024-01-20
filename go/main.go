package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func main() {
	// Retrieve database credentials from environment variables
	dbUser := os.Getenv("DB_USER")         //admin
	dbPassword := os.Getenv("DB_PASSWORD") //Admin123
	dbName := os.Getenv("DB_NAME")         //PSQL
	connStr := fmt.Sprintf("user=%s dbname=%s password=%s host=postgres sslmode=disable", dbUser, dbName, dbPassword)
	// Construct the PostgreSQL connection string
	//connStr := fmt.Sprintf("host=db user=admin password=Admin123 dbname=PSQL port=5432 sslmode=disable")
	//connStr := "postgres://user:mypassword@db:5432/mydatabase?sslmode=disable"
	// Initialize the PostgreSQL connection
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Check if the connection to the database is successful
	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Successfully connected to the database")

	// Initialize the Gin router
	router := gin.Default()

	// Define a simple endpoint to test the connection
	router.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Hello, PostgreSQL is connected!"})
	})

	// Run the server on port 3000
	if err := router.Run(":3000"); err != nil {
		log.Fatal(err)
	}
}
