package page

import (
	db "ProjectAlpha/DB"
	"ProjectAlpha/models"
	"fmt"
	"slices"

	"github.com/lib/pq"
)

func UpdateWebpage(model models.WebpageBasicsModel) (*models.WebpageBasicsModel, error) {
	var updatedWebpage models.WebpageBasicsModel
	err := db.Context.QueryRow(
		"UPDATE webpages SET Name=$1, Template_Id=$2, Preset_Id=$3 , Logo_AccessUrl=$4, Banner_AccessUrl=$5, Custom_Css=$7 WHERE Id=$6 RETURNING Id, Name, Template_Id, Preset_Id, Logo_AccessUrl, Banner_AccessUrl, Custom_Css",
		model.Title,
		model.TemplateId,
		model.PresetId,
		model.Logo,
		model.Banner,
		model.Id,
		model.CustomCss).Scan(

		&updatedWebpage.Id,
		&updatedWebpage.Title,
		&updatedWebpage.TemplateId,
		&updatedWebpage.PresetId,
		&updatedWebpage.Logo,
		&updatedWebpage.Banner,
		&updatedWebpage.CustomCss,
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
	//Begin sql transaction
	tx, commitOrRollback, err := db.BeginTransaction()
	if err != nil {
		return nil, err
	}
	defer commitOrRollback(&err)

	//updating the rows as needed
	var updatedNavbar []models.NavItem
	for i, item := range model {
		var updatedNavitem models.NavItem
		row := tx.QueryRow("UPDATE navbar SET Name=$1, Path=$2, Ranking=$3, Enabled=$4 WHERE Id=$5 AND WebID=$6 RETURNING Id, Name, Path, Enabled", item.Name, item.Path, i, item.IsEnabled, item.Id, webId)
		err = row.Scan(
			&updatedNavitem.Id,
			&updatedNavitem.Name,
			&updatedNavitem.Path,
			&updatedNavitem.IsEnabled,
		)
		if err != nil {
			return nil, err
		}
		updatedNavbar = append(updatedNavbar, updatedNavitem)
	}
	fmt.Println("no error in UpdateNavbar")
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
		return nil, err
	}
	defer commitOrRollback(&err)
	err = tx.QueryRow("UPDATE progress SET Name=$1, Background_AccessUrl=$2 WHERE Id=$3 RETURNING Id, Name, Background_AccessUrl", model.Name, model.BackgroundImg, model.Id).Scan(
		&updatedProgress.Id,
		&updatedProgress.Name,
		&updatedProgress.BackgroundImg,
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
		err = tx.QueryRow("UPDATE raids SET Difficulty=$1, Max=$2, Current=$3 WHERE Id=$4 Returning Id, Difficulty, Max, Current", raid.Difficulty, raid.Max, raid.Current, raid.Id).Scan(
			&updatedRaid.Id,
			&updatedRaid.Difficulty,
			&updatedRaid.Max,
			&updatedRaid.Current,
		)
		if err != nil {
			return nil, err
		}
		updatedProgress.Raids = append(updatedProgress.Raids, updatedRaid)
	}
	for _, raidId := range raidIds {
		err = DeleteRaid(raidId)
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

func UpdateRule(webId int, rule string) (string, error) {
	var updatedRule string
	err := db.Context.QueryRow("UPDATE rules SET Rule=$1 WHERE webId=$2 RETURNING Rule", rule, webId).Scan(&updatedRule)
	if err != nil {
		return "", err
	}

	return updatedRule, nil
}
