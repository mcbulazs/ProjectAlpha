package models

import "time"

type ArticleModel struct {
	Title   string    `json:"title"`
	Date    time.Time `json:"date"`
	Content string    `json:"content"`
}
