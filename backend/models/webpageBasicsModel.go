package models

type WebpageBasicsModel struct {
	Id         int    `json:"id"`
	Title      string `json:"title"`
	TemplateId int    `json:"templateid"`
	PresetId   int    `json:"presetid"`
	Logo       string `json:"logo"`
	Banner     string `json:"banner"`
	CustomCss  string `json:"customcss"`
	Rules      string `json:"rules"`
}
