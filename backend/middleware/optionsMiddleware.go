package middleware

import (
	"net/http"
	"strings"

	"github.com/gorilla/mux"
)

func OptionsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodOptions {
			if route := mux.CurrentRoute(r); route != nil {
				if allowedMethods, err := route.GetMethods(); err == nil {
					// Handle preflight request
					w.Header().Set("Access-Control-Allow-Methods", strings.Join(allowedMethods, ","))
					w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
					w.WriteHeader(http.StatusOK)
					return
				}
			}
		} else {
			next.ServeHTTP(w, r)
		}
	})
}
