package models

import "time"

type CalendarModel struct {
	Id   int       `json:"id"`
	Name string    `json:"name"`
	Date time.Time `json:"date"`
	Type string    `json:"type"`
}
