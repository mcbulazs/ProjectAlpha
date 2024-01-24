package page

import (
	db "ProjectAlpha/DB"
)

func CreateWebpage(userId int) (int, error) {
	result, err := db.Context.Exec("INSERT INTO webpages (Owner_Id) VALUES ($1)", userId)
	if err != nil {
		return 0, err
	}
	insertedID, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}
	return int(insertedID), nil
}
