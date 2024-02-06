package models

import (
	"mime"
	"net/http"
)

type FileModel struct {
	FileData []byte `json:"filedata"`
	Type     string `json:"type"`
	CorrId   int    `json:"corrid"` // corresponding id; Eg. banner image's corrid is the webId, the progess's background is the progressId
}

func (file FileModel) Extension() (string, error) {
	mimeType := http.DetectContentType(file.FileData)
	exts, err := mime.ExtensionsByType(mimeType)
	if err != nil {
		return "", err
	}
	//return http.DetectContentType(file.FileData).Extension
	return exts[0], nil
}
