package models

type RaidModel struct {
	Difficulty string `json:"difficulty"`
	Max        int    `json:"max"`
	Min        int    `json:"min"`
}
