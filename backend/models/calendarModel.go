package models

import "time"

type calendarModel struct {
	Name string    `json:"name"`
	Date time.Time `json:"date"`
	Type string    `json:"type"`
}
