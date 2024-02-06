package controllers

import (
	db "ProjectAlpha/DB"
	"ProjectAlpha/JSON"
	ChannelType "ProjectAlpha/enums/channelEnum"
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
		updatedArticle, err := page.UpdateArticle(article)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		JSON.SendJSON(w, updatedArticle)
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
		updatedRecruitment, err := page.UpdateRecruitment(recruitment)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		JSON.SendJSON(w, updatedRecruitment)
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
		updatedProgress, err := page.UpdateProgress(progress)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		JSON.SendJSON(w, updatedProgress)
	}
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
	channelObject, err := page.SaveChannels(web_id, youtube, ChannelType.YOUTUBE)
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
	channelObject, err := page.SaveChannels(web_id, twitch, ChannelType.TWITCH)
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
		updatedYoutube, err := page.UpdateChannel(ChannelType.YOUTUBE, channel)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		JSON.SendJSON(w, updatedYoutube)
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
		updatedTwitch, err := page.UpdateChannel(ChannelType.TWITCH, channel)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		JSON.SendJSON(w, updatedTwitch)
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
		updatedCalendar, err := page.UpdateCalendar(calendar)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		JSON.SendJSON(w, updatedCalendar)
	}
}

func Controller_Page_Rules_Save(w http.ResponseWriter, r *http.Request) {
	var rules []models.RulesModel
	err := json.NewDecoder(r.Body).Decode(&rules)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	web_id, err := functions.GetWebId(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	rulesObject, err := page.SaveRules(web_id, rules)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	JSON.SendJSON(w, rulesObject)
}

func Controller_Page_Rules_Modify(w http.ResponseWriter, r *http.Request) {
	//check if the webid and records webid are the same
	id, err := strconv.Atoi(mux.Vars(r)["Id"])
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	ok, err := validateId(r, id, "rules")
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
		err = page.DeleteRecord(id, "rules")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	case http.MethodPatch:
		var rule models.RulesModel
		err := json.NewDecoder(r.Body).Decode(&rule)
		fmt.Println(rule)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		rule.Id = id
		updatedRule, err := page.UpdateRule(rule)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		JSON.SendJSON(w, updatedRule)
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
