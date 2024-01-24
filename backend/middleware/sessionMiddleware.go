package middleware

import (
	"ProjectAlpha/functions"
	"net/http"
	"slices"
)

func SessionMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		//setting up header
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		origin := r.Header.Get("Origin")
		if slices.Contains(functions.AllowedOrigins, origin) {
			w.Header().Set("Access-Control-Allow-Origin", origin)
		}
		//except for login and register u need session for everything
		unSessionedEndPoints := []string{"/login", "/register"}
		if !slices.Contains(unSessionedEndPoints, r.URL.Path) {
			// Get the session from the store
			session, _ := functions.Store.Get(r, "session")

			_, ok := session.Values["user_id"].(int) // valid user
			if !ok && r.URL.Path != "/auth" {
				http.Error(w, "User not authenticated", http.StatusUnauthorized)
				return
			} else if !ok && r.URL.Path == "/auth" { //just to decide whetger the user have a session or not
				w.Header().Set("authenticated", "false")
			} else if ok && r.URL.Path == "/auth" {
				w.Header().Set("authenticated", "true")
			}
		}
		next.ServeHTTP(w, r)
	})
}
