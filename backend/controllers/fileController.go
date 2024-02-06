package controllers

import (
	"ProjectAlpha/JSON"
	"ProjectAlpha/enums/errors"
	"ProjectAlpha/functions"
	"ProjectAlpha/functions/file"
	"ProjectAlpha/models"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/gorilla/mux"
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
	if err != nil {
		if err.Error() == errors.FileSizeTooBig {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		} else {

			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
	JSON.SendJSON(w, file, "accessurl")
}

func Controller_File_Serve(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	webID, ok := vars["webId"]
	if !ok {
		http.NotFound(w, r)
		return
	}

	// Construct the file path based on the dynamic {webId} parameter
	if len(strings.Split(r.URL.Path, ".")) != 2 {
		http.Error(w, "can't access directory", http.StatusForbidden)
		return
	}
	filePath := "/app/files/" + webID + r.URL.Path[len("/page/"+webID+"/files"):]
	fmt.Printf("trying to serve: %s \n", filePath)
	// Use http.ServeFile to serve the file
	w.Header().Set("Content-Type", "image/png")
	http.ServeFile(w, r, filePath)

}
