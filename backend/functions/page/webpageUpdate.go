package page

import (
	db "ProjectAlpha/DB"
	"ProjectAlpha/models"
	"fmt"
	"slices"
	"strings"

	"github.com/lib/pq"
)

func UpdateWebpage(model models.WebpageBasicsModel) error {
	_, err := db.Context.Exec("UPDATE webpage SET Title=$1, PresetId=$2 WHERE Id=$3", model.Title, model.PresetId, model.Id)
	if err != nil {
		return err
	}
	return nil
}

func UpdateArticle(model models.ArticleModel) error {
	_, err := db.Context.Exec("UPDATE articles SET Title=$1, Date=$2, Content=$3 WHERE Id=$4", model.Title, model.Date, model.Content, model.Id)
	if err != nil {
		return err
	}
	return nil
}

func UpdateRecruitment(model models.RecruitmentModel) error {
	tx, commitOrRollback, err := db.BeginTransaction()
	if err != nil {
		return nil
	}
	defer commitOrRollback()

	_, err = tx.Exec("UPDATE recruitment SET Class=$1, Subclass=ARRAY[$2] WHERE Id=$3", model.Class, pq.Array(model.Subclasses), model.Id)
	if err != nil {
		return err
	}
	return nil
}

func UpdateNavbar(model []models.NavItem, webId int) error {

	tx, commitOrRollback, err := db.BeginTransaction()
	if err != nil {
		return nil
	}
	defer commitOrRollback()
	//checking all ids
	var navIds []int
	for _, v := range model {
		navIds = append(navIds, v.Id)
	}
	var placeholders []string
	for _, i := range navIds {
		placeholders = append(placeholders, fmt.Sprintf("$%d", i))
	}
	query := fmt.Sprintf("SELECT WebID FROM navbar WHERE Id IN (%s)", strings.Join(placeholders, ", "))
	rows, err := tx.Query(query, navIds)
	if err != nil {
		return err
	}
	defer rows.Close()

	for rows.Next() {
		var webId_db int
		err = rows.Scan(&webId_db)
		if err != nil {
			return err
		}
		if webId_db != webId {
			return fmt.Errorf("invalid webid")
		}
	}

	for i, item := range model {
		slices.DeleteFunc(navIds, func(e int) bool { return e == item.Id })
		_, err := tx.Exec("UPDATE navbar SET Name=$1, Path=$2, Ranking=$3 WHERE Id=$4", item.Name, item.Path, i, item.Id)
		if err != nil {
			return err
		}
	}

	for _, Id := range navIds {
		_, err := db.Context.Exec("DELETE FROM navbar WHERE id=$1", Id)
		if err != nil {
			return err
		}
	}
	return nil
}

func UpdateChannel(site string, model models.ChannelModel) error {
	tx, commitOrRollback, err := db.BeginTransaction()
	if err != nil {
		return nil
	}
	defer commitOrRollback()

	_, err = tx.Exec("UPDATE channels SET Type=$1, Name=$2, Link=$3 WHERE Id=$4", site, model.Name, model.Link, model.Id)
	if err != nil {
		return err
	}
	return nil
}

func UpdateProgress(model models.ProgressModel) error {
	tx, commitOrRollback, err := db.BeginTransaction()
	if err != nil {
		return nil
	}
	defer commitOrRollback()
	_, err = tx.Exec("UPDATE progress SET Name=$1 WHERE Id=$2", model.Name, model.Id)
	if err != nil {
		return err
	}
	raidIds, err := getRaidIdsByProgressionId(model.Id)
	if err != nil {
		return err
	}
	for _, raid := range model.Raids {
		slices.DeleteFunc(raidIds, func(e int) bool { return e == raid.Id })
		_, err := tx.Exec("UPDATE raids SET Difficulty=$1, Max=$2, Current=$3 WHERE Id=$4", raid.Difficulty, raid.Max, raid.Current, raid.Id)
		if err != nil {
			return err
		}
	}
	for _, raidId := range raidIds {
		err := DeleteRaid(raidId)
		if err != nil {
			return err
		}
	}
	return nil
}
func getRaidIdsByProgressionId(id int) ([]int, error) {
	rows, err := db.Context.Query("select Id from riads where ProgressId=$1", id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var result []int
	for rows.Next() {
		var raidId int
		err = rows.Scan(&raidId)
		if err != nil {
			return nil, err
		}
		result = append(result, raidId)
	}
	return result, nil
}

func UpdateCalendar(model models.CalendarModel) error {
	_, err := db.Context.Exec("UPDATE calendar SET Name=$1, Date=$2, Type=$3 WHERE Id=$4", model.Name, model.Date, model.Type, model.Id)
	if err != nil {
		return err
	}

	return nil
}
