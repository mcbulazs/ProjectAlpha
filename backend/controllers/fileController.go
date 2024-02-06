package controllers

import (
	"ProjectAlpha/JSON"
	"ProjectAlpha/enums/errors"
	"ProjectAlpha/functions"
	"ProjectAlpha/functions/file"
	"ProjectAlpha/functions/page"
	"database/sql"
	"fmt"
	"io"
	"net/http"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/gorilla/mux"
)

func Controller_File_Save(w http.ResponseWriter, r *http.Request) {
	web_id, err := functions.GetWebId(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if !strings.Contains(r.Header.Get("Content-Type"), "image") {
		http.Error(w, "not image type", http.StatusBadRequest)
		return
	}
	img, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	file, err := file.SaveFile(web_id, img)
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
	fmt.Println(r.URL.Path)
	if r.URL.Path == fmt.Sprintf("/page/%s/files", webID) {
		id, err := strconv.Atoi(webID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		files, err := file.GetFiles(id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		JSON.SendJSON(w, files)
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
func Controller_Outer_File_Serve(w http.ResponseWriter, r *http.Request) {
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

	if len(strings.Split(r.URL.Path, ".")) != 2 {
		http.Error(w, "can't access directory", http.StatusForbidden)
		return
	}

	filePath := filepath.Join("/app/files", strconv.Itoa(webId), r.URL.Path[len("/page/"+strconv.Itoa(webId)+"/files/"):])
	fmt.Printf("trying to serve: %s \n", filePath)
	// Use http.ServeFile to serve the file
	w.Header().Set("Content-Type", "image/png")
	http.ServeFile(w, r, filePath)
}