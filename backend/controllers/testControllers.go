package controllers

import "net/http"

func Controller_Test(w http.ResponseWriter, r *http.Request) {

	//SaveModel(w, r, page.SaveCalendar)
}

/*
func Controller_Test2(w http.ResponseWriter, r *http.Request) {

	SaveModel(w, r, page.SaveProgress)
}

func SaveModel[T any](w http.ResponseWriter, r *http.Request, saveFunc func(int, []T) ([]T, error)) {
	var object []T
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
}*/
