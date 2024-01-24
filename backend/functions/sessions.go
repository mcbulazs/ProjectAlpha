package functions

import (
	db "ProjectAlpha/DB"
	"ProjectAlpha/functions/page"
	"net/http"
	"os"

	"github.com/gorilla/sessions"
)

var Store = sessions.NewCookieStore([]byte(os.Getenv("SESSION_KEY")))
var AllowedOrigins []string

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
		AllowedOrigins = append(AllowedOrigins, ori)
	}
	return nil
}

func CreateSession(w http.ResponseWriter, r *http.Request, userId int) {
	web_id, err := page.CreateWebpage(userId)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	session, _ := Store.Get(r, "session")
	session.Values["user_id"] = userId
	session.Values["web_id"] = web_id
	session.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   3600,
		HttpOnly: true,
	}
	session.Save(r, w)
}
