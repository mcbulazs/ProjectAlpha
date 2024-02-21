package errors

import (
	"errors"
)

var (
	FileSizeTooBig        error = errors.New("size of the file exceeds limit")
	DirectorySizeTooBig   error = errors.New("size of the directory exceeds limit")
	NotMatchingIds        error = errors.New("ids not matching")
	TypeDoesntExist       error = errors.New("the type doesn't exist")
	InvalidPasswordFormat error = errors.New("invalid password format")
	UsernameTaken         error = errors.New("username taken")
	BadFileFormat         error = errors.New("bad file format")
	AssetAlreadyExists    error = errors.New("asset already exists")
)
