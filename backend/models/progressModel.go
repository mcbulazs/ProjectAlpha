package models

type ProgressModel struct {
	Name  string      `json:"name"`
	Raids []RaidModel `json:"raids"`
}
