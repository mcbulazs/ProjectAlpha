package models

type Navbar struct {
	Name  string `json:"name"`
	Path  string `json:"path"`
	Order int    `json:"order"`
}
