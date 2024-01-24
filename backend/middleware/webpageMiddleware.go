package middleware

import (
	db "ProjectAlpha/DB"
	"ProjectAlpha/functions"
	"net/http"

	"github.com/gorilla/mux"
)

func CheckWebpageMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		id := vars["id"]

		session, _ := functions.Store.Get(r, "session")

		user_id, _ := session.Values["user_id"].(int)

		row := db.Context.QueryRow("SELECT ownerId FROM webpage WHERE id=$1", id)
		var ownerId int
		err := row.Scan(&ownerId)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if ownerId != user_id {
			http.Error(w, "current user is not the owner of the site", http.StatusUnauthorized)
			return
		}

		next.ServeHTTP(w, r)
	})
}
