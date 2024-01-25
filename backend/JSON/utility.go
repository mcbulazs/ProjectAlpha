package JSON

import (
	"encoding/json"
	"net/http"
)

func SendJSON(w http.ResponseWriter, obj any, wrapper ...string) {

	data, err := json.Marshal(obj)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if len(wrapper) > 0 {
		data = append([]byte("{\""+wrapper[0]+"\":"), data...)
		data = append(data, []byte("}")...)
	}
	w.Write(data)
}
