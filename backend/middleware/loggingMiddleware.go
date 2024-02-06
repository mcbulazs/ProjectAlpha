package middleware

import (
	"fmt"
	"net/http"
	"os"
)

func LoggingMiddleware(next http.Handler) http.Handler {

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		//setting up header
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		origin := r.Header.Get("Origin")
		if os.Getenv("INDEV") == "TRUE" {
			w.Header().Set("Access-Control-Allow-Origin", origin)
		} else {
			w.Header().Set("Access-Control-Allow-Origin", os.Getenv("ORIGIN"))
		}
		fmt.Println(r.Method, "from", origin, "on", r.URL) //! DEBUG

		next.ServeHTTP(w, r)
	})
}
