package page

import (
	db "ProjectAlpha/DB"
	"ProjectAlpha/models"
	"slices"

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

func UpdateRecruitment(model []models.RecruitmentModel) error {
	tx, commitOrRollback, err := db.BeginTransaction()
	if err != nil {
		return nil
	}
	defer commitOrRollback()

	for _, item := range model {
		_, err := tx.Exec("UPDATE recruitment SET Class=$1, Subclass=ARRAY[$2] WHERE Id=$3", item.Class, pq.Array(item.Subclasses), item.Id)
		if err != nil {
			return err
		}
	}
	return nil
}

func UpdateNavbar(model []models.Navbar) error {
	tx, commitOrRollback, err := db.BeginTransaction()
	if err != nil {
		return nil
	}
	defer commitOrRollback()

	for _, item := range model {
		_, err := tx.Exec("UPDATE navbar SET Name=$1, Path=$2, Ranking=$3 WHERE Id=$4", item.Name, item.Path, item.Order, item.Id)
		if err != nil {
			return err
		}
	}
	return nil
}

func UpdateChannel(site string, model []models.ChannelModel) error {
	tx, commitOrRollback, err := db.BeginTransaction()
	if err != nil {
		return nil
	}
	defer commitOrRollback()

	for _, item := range model {
		_, err := tx.Exec("UPDATE channels SET Type=$1, Name=$2, Link=$3 WHERE Id=$4", site, item.Name, item.Link, item.Id)
		if err != nil {
			return err
		}
	}
	return nil
}

func UpdateProgress(model []models.ProgressModel) error {
	tx, commitOrRollback, err := db.BeginTransaction()
	if err != nil {
		return nil
	}
	defer commitOrRollback()

	for _, item := range model {
		_, err := tx.Exec("UPDATE progress SET Name=$1 WHERE Id=$2", item.Name, item.Id)
		if err != nil {
			return err
		}
		raidIds, err := getRaidIdsByProgressionId(item.Id)
		if err != nil {
			return err
		}
		for _, raid := range item.Raids {
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
