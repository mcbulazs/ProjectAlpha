package functions

import (
	db "ProjectAlpha/DB"
	"fmt"
	"net/http"
	"os"
	"slices"

	"github.com/gorilla/sessions"
)

var Store = sessions.NewCookieStore([]byte(os.Getenv("SESSION_KEY")))
var allowedOrigins []string

func Init_allowed_origins() error {
	rows, err := db.Context.Query("select Origin from allowed_origins")
	if err != nil {
		return err
	}
	for rows.Next() {
		var ori string
		if err := rows.Scan(&ori); err != nil {
			return err
		}
		allowedOrigins = append(allowedOrigins, ori)
	}
	return nil
}

func CreateSession(w http.ResponseWriter, r *http.Request, userId int) {
	session, _ := Store.Get(r, "session")
	session.Values["user_id"] = userId
	session.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   3600,
		HttpOnly: true,
	}
	session.Save(r, w)
}

func SessionMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Get the session from the store
		fmt.Println("elotte")
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		origin := r.Header.Get("Origin")
		if slices.Contains(allowedOrigins, origin) {
			w.Header().Set("Access-Control-Allow-Origin", origin)
		}

		if r.URL.Path != "/login" && r.URL.Path != "/register" {
			session, _ := Store.Get(r, "session")

			_, ok := session.Values["user_id"].(int)
			if !ok {
				http.Error(w, "User not authenticated", http.StatusUnauthorized)
				return
			}
		}
		next.ServeHTTP(w, r)
	})
}
