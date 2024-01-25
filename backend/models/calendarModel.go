package models

import "time"

type CalendarModel struct {
	Name string    `json:"name"`
	Date time.Time `json:"date"`
	Type string    `json:"type"`
}
