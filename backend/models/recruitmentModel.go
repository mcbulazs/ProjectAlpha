package models

type RecruitmentModel struct {
	Id         int      `json:"id"`
	Class      string   `json:"class"`
	Subclasses []string `json:"subclasses"`
}
