package JSON

import (
	"encoding/json"
	"net/http"
	"net/url"
	"strings"
)

type Toast struct {
	Type string `json:"type"`
	Msg  string `json:"msg"`
	Img  string `json:"img"`
}

type PostError string

func Trim(s string) string {
	return strings.TrimSpace(s)
}

func NewError(errors *[]string, error string) {
	*errors = append(*errors, error)
}

func SendJSON(w http.ResponseWriter, obj any, wrapper ...string) {

	data, err := json.Marshal(obj)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	//errors_data, err := json.Marshal(errors)
	/*if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}*/
	if len(wrapper) > 0 {
		data = append([]byte("{\""+wrapper[0]+"\":"), data...)
		//data = append(data, []byte(", \"errors\":"+string(errors_data))...)
		data = append(data, []byte("}")...)
	} /*else {
		data = append(data, []byte(", \"errors\":"+string(errors_data))...)
	}*/
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Write(data)
}

func SendErrors(w http.ResponseWriter, errors *[]PostError) {
	data, err := json.Marshal(errors)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	data = append([]byte("{\"errors\":"), data...)
	data = append(data, []byte("}")...)
	w.Header().Set("Content-Type", "application/json")
	w.Write(data)
}

func IsSet(post *url.Values, field string) bool {
	return !(!post.Has(field) || Trim(post.Get(field)) == "")
}
