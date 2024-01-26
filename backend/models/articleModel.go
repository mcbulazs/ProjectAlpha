package models

import "time"

type ArticleModel struct {
	Id      int       `json:"id"`
	Title   string    `json:"title"`
	Date    time.Time `json:"date"`
	Content string    `json:"content"`
}
