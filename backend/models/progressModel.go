package models

type ProgressModel struct {
	Id    int         `json:"id"`
	Name  string      `json:"name"`
	Raids []RaidModel `json:"raids"`
}
