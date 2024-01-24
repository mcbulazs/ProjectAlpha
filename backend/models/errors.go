package models

type LoginFailed struct{}

func (m *LoginFailed) Error() string {
	return "Bad username/password!"
}
