package controllers

import (
	db "ProjectAlpha/DB"
	"ProjectAlpha/JSON"
	"ProjectAlpha/functions"
	"ProjectAlpha/functions/page"
	"ProjectAlpha/models"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

func Controller_Page_Articles_Save(w http.ResponseWriter, r *http.Request) {
	var article models.ArticleModel
	err := json.NewDecoder(r.Body).Decode(&article)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	web_id, err := functions.GetWebId(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	page.SaveArticle(web_id, article)

}
func Controller_Page_Articles_Modify(w http.ResponseWriter, r *http.Request) {
	//check if the webid and records webid are the same
	id, err := strconv.Atoi(mux.Vars(r)["Id"])
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	ok, err := validateId(r, id, "articles")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if !ok {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}
	switch r.Method {
	case http.MethodDelete:
		err = page.DeleteRecord(id, "articles")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	case http.MethodPatch:
		var article models.ArticleModel
		err := json.NewDecoder(r.Body).Decode(&article)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		article.Id = id
		err = page.UpdateArticle(article)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

func Controller_Page_Get(w http.ResponseWriter, r *http.Request) {
	webId, err := functions.GetWebId(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	fmt.Println(webId)
	result, err := page.GetWebContent(webId)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	JSON.SendJSON(w, result)
}

func validateId(r *http.Request, Id int, tableName string) (bool, error) {

	webId, err := functions.GetWebId(r)
	if err != nil {
		return false, err
	}
	var webId_db int
	query := fmt.Sprintf("SELECT WebId FROM %s WHERE Id=$1", tableName)
	row := db.Context.QueryRow(query, Id)
	err = row.Scan(&webId_db)
	if err != nil {
		return false, err
	}
	if webId_db != webId {
		return false, nil
	}
	return true, nil
}
