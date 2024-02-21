package controllers

import (
	db "ProjectAlpha/DB"
	"ProjectAlpha/JSON"
	"ProjectAlpha/functions"
	"ProjectAlpha/functions/page"
	"ProjectAlpha/models"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

func Controller_Outer_Page_Get(w http.ResponseWriter, r *http.Request) {
	origin := r.Header.Get("Origin")
	webId, err := page.GetWebIdByOrigin(origin)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Origin is not the owner", http.StatusUnauthorized)
			return
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Access-Control-Allow-Origin", origin)
	result, err := page.GetWebContent(webId)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	JSON.SendJSON(w, result)
}

func Controller_Page(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
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
	case http.MethodPatch:
		var webpageBasics models.WebpageBasicsModel
		err := json.NewDecoder(r.Body).Decode(&webpageBasics)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		updatedWebpage, err := page.UpdateWebpage(webpageBasics)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		JSON.SendJSON(w, updatedWebpage)
	}
}

func saveModel[T any](w http.ResponseWriter, r *http.Request, saveFunc func(int, T) (*T, error)) {
	var object T
	err := json.NewDecoder(r.Body).Decode(&object)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	web_id, err := functions.GetWebId(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	returnObject, err := saveFunc(web_id, object)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	JSON.SendJSON(w, returnObject)
}

func modifyModel[T any](w http.ResponseWriter, r *http.Request, updateFunc func(T, int) (*T, error), tableName string) {
	id, err := strconv.Atoi(mux.Vars(r)["Id"])
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	ok, err := validateId(r, id, tableName)
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
		err = page.DeleteRecord(id, tableName)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	case http.MethodPatch:
		var object T
		err := json.NewDecoder(r.Body).Decode(&object)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		updatedArticle, err := updateFunc(object, id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		JSON.SendJSON(w, updatedArticle)
	}
}

func modifyBaseModel(w http.ResponseWriter, r *http.Request, columnName string) {
	web_id, err := functions.GetWebId(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	var value string
	err = json.NewDecoder(r.Body).Decode(&value)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	result, err := page.UpdateWebpageProp(columnName, value, web_id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	JSON.SendJSON(w, result)
}

func Controller_Page_CustomCss(w http.ResponseWriter, r *http.Request) {
	modifyBaseModel(w, r, "Custom_Css")
}

func Controller_Page_Rules(w http.ResponseWriter, r *http.Request) {
	modifyBaseModel(w, r, "Rules")
}

func Controller_Page_Articles_Save(w http.ResponseWriter, r *http.Request) {
	saveModel[models.ArticleModel](w, r, page.SaveArticle)
}

func Controller_Page_Articles_Modify(w http.ResponseWriter, r *http.Request) {
	modifyModel[models.ArticleModel](w, r, page.UpdateArticle, "articles")
}

func Controller_Page_Recruitment_Save(w http.ResponseWriter, r *http.Request) {
	saveModel[models.RecruitmentModel](w, r, page.SaveRecruitment)
}

func Controller_Page_Recruitment_Modify(w http.ResponseWriter, r *http.Request) {
	modifyModel[models.RecruitmentModel](w, r, page.UpdateRecruitment, "recruitment")
}

func Controller_Page_Progress_Save(w http.ResponseWriter, r *http.Request) {
	saveModel[models.ProgressModel](w, r, page.SaveProgress)
}

func Controller_Page_Progress_Modify(w http.ResponseWriter, r *http.Request) {
	modifyModel[models.ProgressModel](w, r, page.UpdateProgress, "progress")
}

func Controller_Page_Navbar_Modify(w http.ResponseWriter, r *http.Request) {
	//check if the webid and records webid are the same
	var navbar []models.NavItem
	err := json.NewDecoder(r.Body).Decode(&navbar)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	webId, err := functions.GetWebId(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	updatedNavbar, err := page.UpdateNavbar(navbar, webId)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	JSON.SendJSON(w, updatedNavbar)

}

func Controller_Page_Channel_Save(w http.ResponseWriter, r *http.Request) {
	saveModel[models.ChannelModel](w, r, page.SaveChannels)
}

func Controller_Page_Channel_Modify(w http.ResponseWriter, r *http.Request) {
	modifyModel[models.ChannelModel](w, r, page.UpdateChannel, "channels")
}

func Controller_Page_Calendar_Save(w http.ResponseWriter, r *http.Request) {
	saveModel[models.CalendarModel](w, r, page.SaveCalendar)
}

func Controller_Page_Calendar_Modify(w http.ResponseWriter, r *http.Request) {
	modifyModel[models.CalendarModel](w, r, page.UpdateCalendar, "calendar")
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
