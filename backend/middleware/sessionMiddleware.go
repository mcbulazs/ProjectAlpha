package middleware

import (
	"ProjectAlpha/functions"
	"net/http"
	"slices"
)

func SessionMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Get the session from the store
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		origin := r.Header.Get("Origin")
		if slices.Contains(functions.AllowedOrigins, origin) {
			w.Header().Set("Access-Control-Allow-Origin", origin)
		}

		if r.URL.Path != "/login" && r.URL.Path != "/register" {
			session, _ := functions.Store.Get(r, "session")

			_, ok := session.Values["user_id"].(int)
			if !ok {
				http.Error(w, "User not authenticated", http.StatusUnauthorized)
				return
			}
		}
		next.ServeHTTP(w, r)
	})
}
