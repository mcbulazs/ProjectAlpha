package controllers

import (
	"ProjectAlpha/JSON"
	"ProjectAlpha/enums/errors"
	"ProjectAlpha/functions"
	"ProjectAlpha/functions/file"
	"ProjectAlpha/models"
	"encoding/json"
	"net/http"
)

func Controller_File_Save(w http.ResponseWriter, r *http.Request) {
	web_id, err := functions.GetWebId(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	var fileModel models.FileModel
	err = json.NewDecoder(r.Body).Decode(&fileModel)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	file, err := file.SaveFile(web_id, fileModel)
	if err.Error() == errors.FileSizeTooBig {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	JSON.SendJSON(w, file)
}
