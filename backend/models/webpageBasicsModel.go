package models

type WebpageBasicsModel struct {
	Id         int    `json:"id"`
	Title      string `json:"title"`
	TemplateId int    `json:"templateid"`
	Logo       string `json:"logo"`
	Banner     string `json:"banner"`
}
