package page

import (
	db "ProjectAlpha/DB"
	"ProjectAlpha/models"
	"encoding/json"
	"fmt"

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
		model.CustomCss,
	).Scan(
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

func UpdateWebpageProp(columnName string, value string, webId int) (*string, error) {
	var result string
	query := fmt.Sprintf("UPDATE webpages SET %s=$1 WHERE Id=$2 RETURNING %s", columnName, columnName)
	err := db.Context.QueryRow(query,
		value,
		webId,
	).Scan(
		&result,
	)
	if err != nil {
		return nil, err
	}
	return &result, nil
}

func UpdateArticle(model models.ArticleModel, Id int) (*models.ArticleModel, error) {
	var updatedArticle models.ArticleModel
	err := db.Context.QueryRow("UPDATE articles SET Title=$1, Content=$2 WHERE Id=$3 RETURNING Id, Title, Date, Content",
		model.Title,
		model.Content,
		Id,
	).Scan(
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

func UpdateRecruitment(model models.RecruitmentModel, Id int) (*models.RecruitmentModel, error) {
	var updatedRecruitment models.RecruitmentModel

	var subclasses pq.StringArray
	err := db.Context.QueryRow("UPDATE recruitment SET Class=$1, Subclass=$2 WHERE Id=$3 RETURNING Id, Class, Subclass",
		model.Class,
		pq.Array(model.Subclasses),
		Id,
	).Scan(
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
		err := tx.QueryRow("UPDATE navbar SET Name=$1, Path=$2, Ranking=$3, Enabled=$4 WHERE Id=$5 AND WebID=$6 RETURNING Id, Name, Path, Enabled",
			item.Name,
			item.Path,
			i,
			item.IsEnabled,
			item.Id,
			webId,
		).Scan(
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

func UpdateChannel(model models.ChannelModel, Id int) (*models.ChannelModel, error) {
	var updateChannel models.ChannelModel
	err := db.Context.QueryRow("UPDATE channels SET Site=$1, Name=$2, Link=$3 WHERE Id=$4 RETURNING Id, Site, Name, Link",
		model.Site,
		model.Name,
		model.Link,
		Id,
	).Scan(
		&updateChannel.Id,
		&updateChannel.Site,
		&updateChannel.Name,
		&updateChannel.Link,
	)
	if err != nil {
		return nil, err
	}
	return &updateChannel, nil
}

func UpdateProgress(model models.ProgressModel, Id int) (*models.ProgressModel, error) {
	var updatedProgress models.ProgressModel

	raidsJSON, err := json.Marshal(model.Raids)
	var raidsJSONB []byte
	if err != nil {
		return nil, err
	}
	err = db.Context.QueryRow("UPDATE progress SET Name=$1, Background_AccessUrl=$2, Raids=$3 WHERE Id=$4 RETURNING Id, Name, Background_AccessUrl, Raids",
		model.Name,
		model.BackgroundImg,
		raidsJSON,
		Id,
	).Scan(
		&updatedProgress.Id,
		&updatedProgress.Name,
		&updatedProgress.BackgroundImg,
		&raidsJSONB,
	)
	if err != nil {
		return nil, err
	}
	err = json.Unmarshal(raidsJSONB, &updatedProgress.Raids)
	if err != nil {
		return nil, err
	}
	return &updatedProgress, nil
}

func UpdateCalendar(model models.CalendarModel, Id int) (*models.CalendarModel, error) {
	var updatedCalendar models.CalendarModel
	err := db.Context.QueryRow("UPDATE calendar SET Name=$1, Date=$2, Type=$3 WHERE Id=$4 RETURNING Id, Name, Date, Type",
		model.Name,
		model.Date,
		model.Type,
		Id,
	).Scan(
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
