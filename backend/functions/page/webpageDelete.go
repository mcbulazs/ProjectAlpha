package page

import (
	db "ProjectAlpha/DB"
	"fmt"
)

func DeleteRecord(id int, tableName string) error {
	query := fmt.Sprintf("DELETE FROM %s WHERE id=$1", tableName)
	_, err := db.Context.Exec(query, id)
	if err != nil {
		return err
	}
	return nil
}

func DeleteProgress(id int) error {
	_, err := db.Context.Exec("DELETE FROM raids WHERE ProgressId=$1", id)
	if err != nil {
		return err
	}
	_, err = db.Context.Exec("DELETE FROM progess WHERE Id=$1", id)
	if err != nil {
		return err
	}
	return nil
}
func DeleteRaid(id int) error {
	_, err := db.Context.Exec("DELETE FROM raids WHERE id=$1", id)
	if err != nil {
		return err
	}
	return nil
}
