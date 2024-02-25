package page

import (
	db "ProjectAlpha/DB"
	"ProjectAlpha/enums/errors"
	"ProjectAlpha/models"
	"database/sql"
	"encoding/json"
	"time"

	"github.com/lib/pq"
)

func CreateWebpage(userId int) (int, error) {
	tx, commitOrRollback, err := db.BeginTransaction()
	if err != nil {
		return 0, err
	}
	defer commitOrRollback(&err)
	var webId int
	row := tx.QueryRow("SELECT Id FROM webpages WHERE Owner_Id=$1", userId)

	err = row.Scan(&webId)
	if err == nil {
		return webId, nil
	} else if err != sql.ErrNoRows {
		return 0, err
	}

	err = tx.QueryRow("INSERT INTO webpages (Owner_Id) VALUES ($1) RETURNING Id", userId).Scan(&webId)
	if err != nil {
		return 0, err
	}
	query := "INSERT INTO navbar (WebId, Name, Path, Ranking) VALUES ($1,'Home','',0), ($2,'About','about',1), ($3,'Rules','rules',2), ($4,'Videos','videos',3), ($5,'Tactics','tactics',3)"
	_, err = tx.Exec(query, webId, webId, webId, webId, webId)
	if err != nil {
		return 0, err
	}
	return webId, nil
}

func SaveArticle(webId int, article models.ArticleModel) (*models.ArticleModel, error) { // single article
	var result models.ArticleModel
	article.Date = time.Now()
	err := db.Context.QueryRow("INSERT INTO articles (WebId,Title,Date,Content) values ($1,$2,$3,$4) RETURNING Id, Title, Date, Content",
		webId,
		article.Title,
		article.Date,
		article.Content,
	).Scan(
		&result.Id,
		&result.Title,
		&result.Date,
		&result.Content,
	)
	if err != nil {
		return nil, err
	}
	return &result, nil
}

func SaveRecruitment(webId int, recruit models.RecruitmentModel) (*models.RecruitmentModel, error) {
	var result models.RecruitmentModel
	var pqArray pq.StringArray
	err := db.Context.QueryRow("INSERT INTO recruitment (WebId, Class, Subclass) VALUES ($1,$2,$3) RETURNING Id, Class, Subclass",
		webId,
		recruit.Class,
		pq.Array(recruit.Subclasses),
	).Scan(
		&result.Id,
		&result.Class,
		&pqArray,
	)
	if err != nil {
		return nil, err
	}
	result.Subclasses = []string(pqArray)
	return &result, nil
}

func SaveChannels(webId int, channel models.ChannelModel) (*models.ChannelModel, error) {
	var result models.ChannelModel
	var highestRanking int
	err := db.Context.QueryRow("", webId).Scan(&highestRanking)
	if err != nil {
		return nil, err
	}
	err = db.Context.QueryRow(
		`INSERT INTO channels (WebId, Site, Name, Link, Ranking) 
		VALUES ($1, $2, $3, $4, (SELECT COALESCE(MAX(Ranking), 0) + 1 FROM channels WHERE WebId=$5)) 
		RETURNING Id, Site, Name, Link`,
		webId,
		channel.Site,
		channel.Name,
		channel.Link,
		webId,
	).Scan(
		&result.Id,
		&result.Site,
		&result.Name,
		&result.Link,
	)
	if err != nil {
		return nil, err
	}
	return &result, nil

}

func SaveProgress(webId int, progess models.ProgressModel) (*models.ProgressModel, error) {
	var result models.ProgressModel
	var resultJson []byte
	raidsJSON, err := json.Marshal(progess.Raids)
	if err != nil {
		return nil, err
	}
	err = db.Context.QueryRow("INSERT INTO progress (WebId, Name, Background_AccessUrl, Raids) VALUES ($1,$2,$3,$4) RETURNING Id, Name, Background_AccessUrl, Raids",
		webId,
		progess.Name,
		progess.BackgroundImg,
		raidsJSON,
	).Scan(
		&result.Id,
		&result.Name,
		&result.BackgroundImg,
		&resultJson,
	)
	if err != nil {
		return nil, err
	}
	err = json.Unmarshal(resultJson, &result.Raids)
	if err != nil {
		return nil, err
	}
	return &result, nil
}

func SaveCalendar(webId int, calendar models.CalendarModel) (*models.CalendarModel, error) {
	var result models.CalendarModel
	err := db.Context.QueryRow("INSERT INTO calendar (WebId, Name, Date, Type) VALUES ($1,$2,$3,$4) RETURNING Id, Name, Date, Type",
		webId,
		calendar.Name,
		calendar.Date,
		calendar.Type,
	).Scan(
		&result.Id,
		&result.Name,
		&result.Date,
		&result.Type,
	)
	if err != nil {
		return nil, err
	}
	return &result, nil
}

func SaveRules(webId int, rules string) (*string, error) {
	//check if it already exists

	var DbwebId int
	row := db.Context.QueryRow("SELECT Id FROM rules WHERE WebId=$1", webId)

	err := row.Scan(&DbwebId)
	if err == nil {
		return nil, errors.AssetAlreadyExists
	} else if err != sql.ErrNoRows {
		return nil, err
	}

	var result string
	query := "INSERT INTO rules (WebId, Rule) VALUES ($1,$2) RETURNING Rule"
	err = db.Context.QueryRow(query, webId, rules).Scan(&result)

	if err != nil {
		return nil, err
	}
	return &result, nil
}
