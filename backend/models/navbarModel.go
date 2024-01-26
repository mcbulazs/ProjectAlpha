package models

type Navbar struct {
	Id    int    `json:"id"`
	Name  string `json:"name"`
	Path  string `json:"path"`
	Order int    `json:"order"`
}
