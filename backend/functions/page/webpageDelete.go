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
func DeleteRecordByWebId(webId int, tableName string) error {
	query := fmt.Sprintf("DELETE FROM %s WHERE WebId=$1", tableName)
	_, err := db.Context.Exec(query, webId)
	if err != nil {
		return err
	}
	return nil
}
