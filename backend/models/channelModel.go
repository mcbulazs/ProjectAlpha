package models

type ChannelModel struct {
	Id   int    `json:"id"`
	Site string `json:"site"`
	Name string `json:"name"`
	Link string `json:"link"`
}
