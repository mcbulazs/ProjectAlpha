package file

import (
	db "ProjectAlpha/DB"
	"ProjectAlpha/enums/errors"
	ImageType "ProjectAlpha/enums/imageTypeEmum.go"
	"ProjectAlpha/models"
	"database/sql"
	"fmt"
	"os"
	"path/filepath"
	"slices"
	"strconv"
)

const MaxFileSize = 8 * 1024 * 1024 //MAX 8 MB

func SaveFile(webId int, file models.FileModel) (*models.FileModel, error) {

	if len(file.FileData) > MaxFileSize {
		return nil, errors.NewError(errors.FileSizeTooBig)
	}

	err := checkFileValidity(file.Type, webId, file.CorrId)
	if err != nil {
		return nil, err
	}

	ok := isImgFormat(file.Extension())
	if !ok {
		return nil, errors.NewError(errors.BadFileFormat)
	}

	err = removeFileIfExists(webId, file.Type, file.CorrId)
	if err != nil {
		return nil, err
	}
	path, err := nameFile(webId, file.Type, file.Extension(), file.CorrId)
	if err != nil {
		return nil, err
	}

	if err := os.MkdirAll(filepath.Dir(*path), 0755); err != nil {
		return nil, err
	}

	file.FileName = *path
	dst, err := os.Create(*path)
	if err != nil {
		return nil, err
	}
	defer dst.Close()

	// Write the file data to the server file
	_, err = dst.Write(file.FileData)
	if err != nil {
		return nil, err
	}
	_, err = db.Context.Exec("INSERT INTO files (Type, Path, CorrId) values ($1, $2, $3) RETURNING Id", file.Type, path, file.CorrId)
	if err != nil {
		return nil, err
	}
	// Optionally, save file metadata to the database
	return &file, nil
}
func nameFile(webId int, fileType string, ext string, corId int) (*string, error) {
	if !ImageType.IsImageType(fileType) {
		return nil, errors.NewError(errors.TypeDoesntExist)
	}
	filename := fmt.Sprintf("%d%s", corId, ext)
	path := filepath.Join("/app/files", strconv.Itoa(webId), "images", fileType, filename)
	return &path, nil
}

func GetFile(webId int, Type string, corrId int) (*models.FileModel, error) {

	err := checkFileValidity(Type, webId, corrId)
	if err != nil {
		return nil, err
	}
	var result models.FileModel
	row := db.Context.QueryRow("SELECT Path, CorrId, Type FROM files WHERE Type=$1 AND CorrId=$2", Type, corrId)

	err = row.Scan(
		&result.FileName,
		&result.CorrId,
		&result.Type,
	)

	if err == sql.ErrNoRows {
		return nil, nil
	} else if err != nil {
		return nil, err
	}
	result.FileData, err = os.ReadFile(result.FileName)
	if err != nil {
		return nil, err
	}
	return &result, nil
}

// returns nil if everything is ok
func isImgFormat(extension string) bool {
	alloweds := []string{".jpg", ".jpeg", ".png"}
	return slices.Contains(alloweds, extension)
}

func checkFileValidity(fileType string, webId int, corrId int) error {
	switch fileType {
	case ImageType.LOGO, ImageType.BANNER, ImageType.WALLPAPER:
		if corrId != webId {
			return errors.NewError(errors.NotMatchingIds)
		}
	case ImageType.PROGRESS:
		var db_webId int
		err := db.Context.QueryRow("SELECT WebId FROM progress WHERE Id=$1", corrId).Scan(&db_webId)
		if err != nil {
			return err
		}
		if db_webId != webId {
			return errors.NewError(errors.NotMatchingIds)
		}
	default:
		return errors.NewError(errors.TypeDoesntExist)
	}
	return nil
}

func removeFileIfExists(webId int, Type string, corrId int) error {
	row := db.Context.QueryRow("DELETE FROM files WHERE Type=$1 AND CorrId=$2 RETURNING Path", Type, corrId)
	var path string
	err := row.Scan(&path)
	if err == sql.ErrNoRows {
		return nil
	} else if err != nil {
		return err
	}
	err = os.Remove(path)
	if err != nil {
		return err
	}
	return nil
}
