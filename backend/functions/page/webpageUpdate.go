package page

import (
	"encoding/json"
	"fmt"

	"github.com/lib/pq"

	db "ProjectAlpha/DB"
	"ProjectAlpha/models"
)

func UpdateWebpageProp(columnName string, value string, webId int) (*string, error) {
	var result string
	query := fmt.Sprintf(
		"UPDATE webpages SET %s=$1 WHERE Id=$2 RETURNING %s",
		columnName,
		columnName,
	)
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

func UpdateWebpageGeneral(
	webId int,
	model models.WebpageGeneralModel,
) (*models.WebpageGeneralModel, error) {
	var result models.WebpageGeneralModel
	// query := fmt.Sprintf(, columnName, columnName)
	err := db.Context.QueryRow("UPDATE webpages SET Name=$1, Logo_AccessUrl=$2, Banner_AccessUrl=$3 WHERE Id=$4 RETURNING Name, Logo_AccessUrl, Banner_AccessUrl",
		model.Title,
		model.Logo,
		model.Banner,
		webId,
	).
		Scan(
			&result.Title,
			&result.Logo,
			&result.Banner,
		)
	if err != nil {
		return nil, err
	}
	return &result, nil
}

func UpdateWebpageTemplate(webId int, model models.TemplateModel) (*models.TemplateModel, error) {
	var result models.TemplateModel
	// query := fmt.Sprintf(, columnName, columnName)
	err := db.Context.QueryRow("UPDATE webpages SET Template_Id=$1, Preset_Id=$2 WHERE Id=$3 RETURNING Template_Id, Preset_Id",
		model.TemplateId,
		model.PresetId,
		webId,
	).
		Scan(
			&result.TemplateId,
			&result.PresetId,
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
	).
		Scan(
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
	).
		Scan(
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

func UpdateNavbar(model models.NavItem, webId int) (*models.NavItem, error) {
	// updating the rows as needed
	if model.Path == "" {
		model.IsEnabled = true
	}
	var updatedNavitem models.NavItem
	err := db.Context.QueryRow("UPDATE navbar SET Name=$1, Enabled=$2 WHERE Path=$3 AND WebID=$4 RETURNING Id, Name, Path, Enabled",
		model.Name,
		model.IsEnabled,
		model.Path,
		webId,
	).
		Scan(
			&updatedNavitem.Id,
			&updatedNavitem.Name,
			&updatedNavitem.Path,
			&updatedNavitem.IsEnabled,
		)
	if err != nil {
		return nil, err
	}
	return &updatedNavitem, nil
}

func UpdateNavbarOrdering(list []string, webId int) error {
	// Begin sql transaction
	tx, commitOrRollback, err := db.BeginTransaction()
	if err != nil {
		return err
	}
	defer commitOrRollback(&err)

	// updating the rows as needed
	for i, item := range list {
		_, err := tx.Exec("UPDATE navbar SET Ranking=$1 WHERE Path=$2 AND WebID=$3",
			i,
			item,
			webId,
		)
		if err != nil {
			return err
		}
	}
	return nil
}

func UpdateChannel(model models.ChannelModel, Id int) (*models.ChannelModel, error) {
	var updateChannel models.ChannelModel
	err := db.Context.QueryRow("UPDATE channels SET Site=$1, Name=$2, Link=$3 WHERE Id=$4 RETURNING Id, Site, Name, Link",
		model.Site,
		model.Name,
		model.Link,
		Id,
	).
		Scan(
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

func UpdateChannelOrdering(list []int, webId int) error {
	// Begin sql transaction
	tx, commitOrRollback, err := db.BeginTransaction()
	if err != nil {
		return err
	}
	defer commitOrRollback(&err)

	// updating the rows as needed
	for i, item := range list {
		_, err := tx.Exec("UPDATE channels SET Ranking=$1 WHERE Id=$2 AND WebID=$3",
			i,
			item,
			webId,
		)
		if err != nil {
			return err
		}
	}
	return nil
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
	).
		Scan(
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
	).
		Scan(
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
