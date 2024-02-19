package middleware

import (
	"ProjectAlpha/functions"
	"net/http"
	"os"
)

func SessionMiddleware(next http.Handler) http.Handler {

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("Origin") != os.Getenv("ORIGIN") && os.Getenv("INDEV") != "TRUE" {
			http.Error(w, "Origin not authenticated", http.StatusUnauthorized)
			return
		}
		if r.Method != http.MethodOptions {
			// Get the session from the store
			session, _ := functions.Store.Get(r, "session")

			_, ok := session.Values["user_id"].(int) // valid user
			if !ok {
				http.Error(w, "User not authenticated", http.StatusUnauthorized)
				return
			}
			//renew session
			session.Options.MaxAge = 3600
			err := session.Save(r, w)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}
		next.ServeHTTP(w, r)
	})
}
