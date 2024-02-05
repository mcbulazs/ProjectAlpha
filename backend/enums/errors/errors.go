package errors

// CustomError is a custom error type.
type Error struct {
	err string
}

const (
	FileSizeTooBig        = "FileSizeTooBig"
	NotMatchingIds        = "NotMatchingIds"
	TypeDoesntExist       = "TypeDoesntExist"
	InvalidPasswordFormat = "InvalidPasswordFormat"
	UsernameTaken         = "UsernameTaken"
)

// Error implements the error interface for CustomError.
func (e Error) Error() string {
	return e.err
}

// NewCustomError creates a new instance of CustomError with the given message.
func NewError(err string) error {
	return Error{err: err}
}
