package models

type WebpageBasicsModel struct {
	Id       int    `json:"id"`
	Title    string `json:"title"`
	PresetId int    `json:"presetid"`
}
