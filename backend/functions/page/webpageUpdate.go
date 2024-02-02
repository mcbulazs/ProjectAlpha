package page

import (
	db "ProjectAlpha/DB"
	"ProjectAlpha/models"
	"fmt"
	"slices"
	"strings"

	"github.com/lib/pq"
)

func UpdateWebpage(model models.WebpageBasicsModel) (*models.WebpageBasicsModel, error) {
	var updatedWebpage models.WebpageBasicsModel
	err := db.Context.QueryRow("UPDATE webpage SET Title=$1, PresetId=$2 WHERE Id=$3 RETURNING Id, Title, PresetId", model.Title, model.PresetId, model.Id).Scan(
		&updatedWebpage.Id,
		&updatedWebpage.Title,
		&updatedWebpage.PresetId,
	)
	if err != nil {
		return nil, err
	}
	return &updatedWebpage, nil
}

func UpdateArticle(model models.ArticleModel) (*models.ArticleModel, error) {
	var updatedArticle models.ArticleModel
	err := db.Context.QueryRow("UPDATE articles SET Title=$1, Date=$2, Content=$3 WHERE Id=$4 RETURNING Id, Title, Date, Content", model.Title, model.Date, model.Content, model.Id).Scan(
		&updatedArticle.Id,
		&updatedArticle.Title,
		&updatedArticle.Date,
		&updatedArticle.Content,
	)
	if err != nil {
		return nil, err
	}
	return &updatedArticle, nil
}

func UpdateRecruitment(model models.RecruitmentModel) (*models.RecruitmentModel, error) {
	var updatedRecruitment models.RecruitmentModel

	var subclasses pq.StringArray
	err := db.Context.QueryRow("UPDATE recruitment SET Class=$1, Subclass=ARRAY[$2] WHERE Id=$3 RETURNING Id, Class, Subclass", model.Class, pq.Array(model.Subclasses), model.Id).Scan(
		&updatedRecruitment.Id,
		&updatedRecruitment.Class,
		&subclasses,
	)
	updatedRecruitment.Subclasses = []string(subclasses)
	if err != nil {
		return nil, err
	}
	return &updatedRecruitment, nil
}

func UpdateNavbar(model []models.NavItem, webId int) ([]models.NavItem, error) {

	tx, commitOrRollback, err := db.BeginTransaction()
	if err != nil {
		return nil, nil
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
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var webId_db int
		err = rows.Scan(&webId_db)
		if err != nil {
			return nil, err
		}
		if webId_db != webId {
			return nil, fmt.Errorf("invalid webid")
		}
	}

	var updatedNavbar []models.NavItem

	for i, item := range model {
		slices.DeleteFunc(navIds, func(e int) bool { return e == item.Id })
		var updatedNavitem models.NavItem
		err := tx.QueryRow("UPDATE navbar SET Name=$1, Path=$2, Ranking=$3 WHERE Id=$4 RETURNING Id, Name, Path", item.Name, item.Path, i, item.Id).Scan(
			&updatedNavitem.Id,
			&updatedNavitem.Name,
			&updatedNavitem.Path,
		)
		if err != nil {
			return nil, err
		}
		updatedNavbar = append(updatedNavbar, updatedNavitem)
	}

	for _, Id := range navIds {
		_, err := db.Context.Exec("DELETE FROM navbar WHERE id=$1", Id)
		if err != nil {
			return nil, err
		}
	}
	return updatedNavbar, nil
}

func UpdateChannel(site string, model models.ChannelModel) (*models.ChannelModel, error) {
	var updateChannel models.ChannelModel
	err := db.Context.QueryRow("UPDATE channels SET Type=$1, Name=$2, Link=$3 WHERE Id=$4 RETURNING Id, Name, Link", site, model.Name, model.Link, model.Id).Scan(
		&updateChannel.Id,
		&updateChannel.Name,
		&updateChannel.Link,
	)
	if err != nil {
		return nil, err
	}
	return &updateChannel, nil
}

func UpdateProgress(model models.ProgressModel) (*models.ProgressModel, error) {
	var updatedProgress models.ProgressModel
	tx, commitOrRollback, err := db.BeginTransaction()
	if err != nil {
		return nil, nil
	}
	defer commitOrRollback()
	err = tx.QueryRow("UPDATE progress SET Name=$1 WHERE Id=$2 RETURNING Id, Name", model.Name, model.Id).Scan(
		&updatedProgress.Id,
		&updatedProgress.Name,
	)
	if err != nil {
		return nil, err
	}
	raidIds, err := getRaidIdsByProgressionId(model.Id)
	if err != nil {
		return nil, err
	}
	for _, raid := range model.Raids {
		slices.DeleteFunc(raidIds, func(e int) bool { return e == raid.Id })
		var updatedRaid models.RaidModel
		err := tx.QueryRow("UPDATE raids SET Difficulty=$1, Max=$2, Current=$3 WHERE Id=$4 Returning Id, Difficulty, Max, Current", raid.Difficulty, raid.Max, raid.Current, raid.Id).Scan(
			&updatedRaid.Id,
			&updatedRaid.Difficulty,
			&updatedRaid.Max,
			&updatedRaid.Current,
		)
		if err != nil {
			return nil, err
		}
		updatedProgress.Raids = append(updatedProgress.Raids)
	}
	for _, raidId := range raidIds {
		err := DeleteRaid(raidId)
		if err != nil {
			return nil, err
		}
	}
	return &updatedProgress, nil
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

func UpdateCalendar(model models.CalendarModel) (*models.CalendarModel, error) {
	var updatedCalendar models.CalendarModel
	err := db.Context.QueryRow("UPDATE calendar SET Name=$1, Date=$2, Type=$3 WHERE Id=$4 RETURNING Id, Name, Date, Type", model.Name, model.Date, model.Type, model.Id).Scan(
		&updatedCalendar.Id,
		&updatedCalendar.Name,
		&updatedCalendar.Date,
		&updatedCalendar.Type,
	)
	if err != nil {
		return nil, err
	}

	return &updatedCalendar, nil
}
