package file

import (
	db "ProjectAlpha/DB"
	"ProjectAlpha/enums/errors"
	"fmt"
	"mime"
	"net/http"
	"os"
	"path/filepath"
)

const MaxFileSize = 8 * 1024 * 1024 //MAX 8 MB

func SaveFile(webId int, file []byte) (string, error) {
	tx, commitOrRollback, err := db.BeginTransaction()
	if err != nil {
		return "", err
	}
	defer commitOrRollback(&err)

	if len(file) > MaxFileSize {
		return "", errors.NewError(errors.FileSizeTooBig)
	}
	ext, err := getExtension(file)
	if err != nil {
		return "", err
	}
	var accessUrl, path string
	row := tx.QueryRow("INSERT INTO files (WebId, Extension) values ($1, $2) RETURNING AccessUrl, Path", webId, ext)
	err = row.Scan(
		&accessUrl,
		&path,
	)
	if err != nil {
		return "", err
	}
	err = os.MkdirAll(filepath.Dir(path), 0755)
	if err != nil {
		return "", err
	}
	dst, err := os.Create(path)
	if err != nil {
		return "", err
	}

	defer func() {
		// Defer a function to close and delete the file in case of an error
		if closeErr := dst.Close(); closeErr != nil {
			fmt.Println("Error closing file:", closeErr)
		}
		if err != nil {
			// Delete the file if an error occurred during write
			if removeErr := os.Remove(path); removeErr != nil {
				fmt.Println("Error removing file:", removeErr)
			}
		}
	}()

	// Write the file data to the server file
	_, err = dst.Write(file)
	if err != nil {
		return "", err
	}
	// Optionally, save file metadata to the database
	return accessUrl, nil
}

func GetFiles(webId int) ([]string, error) {
	var result []string = make([]string, 0)
	rows, err := db.Context.Query("SELECT AccessUrl FROM files where WebId=$1", webId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var s string
		err = rows.Scan(&s)
		if err != nil {
			return nil, err
		}
		result = append(result, s)
	}
	return result, nil
}

func getExtension(filedata []byte) (string, error) {
	mimeType := http.DetectContentType(filedata)
	exts, err := mime.ExtensionsByType(mimeType)
	if err != nil {
		return "", err
	}
	last := exts[len(exts)-1]
	//return http.DetectContentType(file.FileData).Extension
	return last[1:], nil
}