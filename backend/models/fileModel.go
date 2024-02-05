package models

import "path/filepath"

type FileModel struct {
	FileData []byte `json:"filedata"`
	FileName string `json:"filename"`
	Type     string `json:"type"`
	CorrId   int    `json:"corrid"` // corresponding id; Eg. banner image's corrid is the webId, the progess's background is the progressId
}

func (file FileModel) Extension() string {
	return filepath.Ext(file.FileName)
}
