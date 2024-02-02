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
	articleObject, err := page.SaveArticle(web_id, article)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	JSON.SendJSON(w, articleObject)

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

func Controller_Page_Recruitment_Save(w http.ResponseWriter, r *http.Request) {
	var recruitment []models.RecruitmentModel
	err := json.NewDecoder(r.Body).Decode(&recruitment)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	web_id, err := functions.GetWebId(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	recruitObject, err := page.SaveRecruitment(web_id, recruitment)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	JSON.SendJSON(w, recruitObject)
}

func Controller_Page_Recruitment_Modify(w http.ResponseWriter, r *http.Request) {
	//check if the webid and records webid are the same
	id, err := strconv.Atoi(mux.Vars(r)["Id"])
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	ok, err := validateId(r, id, "recruitment")
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
		err = page.DeleteRecord(id, "recruitment")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	case http.MethodPatch:
		var recruitment models.RecruitmentModel
		err := json.NewDecoder(r.Body).Decode(&recruitment)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		recruitment.Id = id
		err = page.UpdateRecruitment(recruitment)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

func Controller_Page_Progress_Save(w http.ResponseWriter, r *http.Request) {
	var progress []models.ProgressModel
	err := json.NewDecoder(r.Body).Decode(&progress)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	web_id, err := functions.GetWebId(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	progressObject, err := page.SaveProgress(web_id, progress)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	JSON.SendJSON(w, progressObject)
}

func Controller_Page_Progress_Modify(w http.ResponseWriter, r *http.Request) {
	//check if the webid and records webid are the same
	id, err := strconv.Atoi(mux.Vars(r)["Id"])
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	ok, err := validateId(r, id, "progress")
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
		err = page.DeleteRecord(id, "progress")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	case http.MethodPatch:
		var progress models.ProgressModel
		err := json.NewDecoder(r.Body).Decode(&progress)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		progress.Id = id
		err = page.UpdateProgress(progress)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

func Controller_Page_Navbar_Save(w http.ResponseWriter, r *http.Request) {
	var navbar []models.NavItem
	err := json.NewDecoder(r.Body).Decode(&navbar)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	web_id, err := functions.GetWebId(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	navbarObject, err := page.SaveNavbar(web_id, navbar)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	JSON.SendJSON(w, navbarObject)
}

func Controller_Page_Navbar_Modify(w http.ResponseWriter, r *http.Request) {
	//check if the webid and records webid are the same
	id, err := strconv.Atoi(mux.Vars(r)["Id"])
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	ok, err := validateId(r, id, "progress")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if !ok {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}
	var navbar []models.NavItem
	err = json.NewDecoder(r.Body).Decode(&navbar)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	webId, err := functions.GetWebId(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	err = page.UpdateNavbar(navbar, webId)
	if err.Error() == "invalid webid" {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

}

func Controller_Page_Youtube_Save(w http.ResponseWriter, r *http.Request) {
	var youtube []models.ChannelModel
	err := json.NewDecoder(r.Body).Decode(&youtube)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	web_id, err := functions.GetWebId(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	channelObject, err := page.SaveChannels(web_id, youtube, "youtube")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	JSON.SendJSON(w, channelObject)
}

func Controller_Page_Twitch_Save(w http.ResponseWriter, r *http.Request) {
	var twitch []models.ChannelModel
	err := json.NewDecoder(r.Body).Decode(&twitch)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	web_id, err := functions.GetWebId(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	channelObject, err := page.SaveChannels(web_id, twitch, "twitch")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	JSON.SendJSON(w, channelObject)

}

func Controller_Page_Youtube_Modify(w http.ResponseWriter, r *http.Request) {
	//check if the webid and records webid are the same
	id, err := strconv.Atoi(mux.Vars(r)["Id"])
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	ok, err := validateId(r, id, "channels")
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
		err = page.DeleteRecord(id, "channels")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	case http.MethodPatch:
		var channel models.ChannelModel
		err := json.NewDecoder(r.Body).Decode(&channel)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		channel.Id = id
		err = page.UpdateChannel("youtube", channel)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

func Controller_Page_Twitch_Modify(w http.ResponseWriter, r *http.Request) {
	//check if the webid and records webid are the same
	id, err := strconv.Atoi(mux.Vars(r)["Id"])
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	ok, err := validateId(r, id, "channels")
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
		err = page.DeleteRecord(id, "channels")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	case http.MethodPatch:
		var channel models.ChannelModel
		err := json.NewDecoder(r.Body).Decode(&channel)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		channel.Id = id
		err = page.UpdateChannel("twitch", channel)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

func Controller_Page_Calendar_Save(w http.ResponseWriter, r *http.Request) {
	var calendar []models.CalendarModel
	err := json.NewDecoder(r.Body).Decode(&calendar)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	web_id, err := functions.GetWebId(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	calendarObject, err := page.SaveCalendar(web_id, calendar)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	JSON.SendJSON(w, calendarObject)
}

func Controller_Page_Calendar_Modify(w http.ResponseWriter, r *http.Request) {
	//check if the webid and records webid are the same
	id, err := strconv.Atoi(mux.Vars(r)["Id"])
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	ok, err := validateId(r, id, "calendar")
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
		err = page.DeleteRecord(id, "calendar")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	case http.MethodPatch:
		var calendar models.CalendarModel
		err := json.NewDecoder(r.Body).Decode(&calendar)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		calendar.Id = id
		err = page.UpdateCalendar(calendar)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
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
