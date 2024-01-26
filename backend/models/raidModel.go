package models

type RaidModel struct {
	Id         int    `json:"id"`
	Difficulty string `json:"difficulty"`
	Max        int    `json:"max"`
	Current    int    `json:"current"`
}
