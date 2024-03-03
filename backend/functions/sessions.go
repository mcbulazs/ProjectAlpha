package functions

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gorilla/sessions"

	db "ProjectAlpha/DB"
	"ProjectAlpha/functions/page"
)

var (
	Store          = sessions.NewCookieStore([]byte(os.Getenv("SESSION_KEY")))
	AllowedOrigins []string
)

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

func CreateSession(w http.ResponseWriter, r *http.Request, userId int) error {
	web_id, err := page.CreateWebpage(userId)
	if err != nil {
		return err
	}
	session, _ := Store.Get(r, "session")
	session.Values["user_id"] = userId
	session.Values["web_id"] = web_id
	session.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   3600,
		HttpOnly: true,
	}
	fmt.Println(session.Options)
	err = session.Save(r, w)
	if err != nil {
		return err
	}
	return nil
}

func GetWebId(r *http.Request) (int, error) {
	session, err := Store.Get(r, "session")
	if err != nil {
		return 0, err
	}
	web_id, ok := session.Values["web_id"].(int)
	if !ok {
		return 0, fmt.Errorf("web_id not int in session")
	}
	return web_id, nil
}
