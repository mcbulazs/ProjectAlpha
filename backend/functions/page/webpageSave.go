package page

import (
	db "ProjectAlpha/DB"
	"ProjectAlpha/models"
	"database/sql"
	"fmt"
	"strconv"
	"time"

	"github.com/lib/pq"
)

func SaveFiles() {
	//Todo: file save
}

func CreateWebpage(userId int) (int, error) {
	tx, commitOrRollback, err := db.BeginTransaction()
	if err != nil {
		return 0, nil
	}
	defer commitOrRollback()
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
	_, err = tx.Exec("INSERT INTO navbar (WebId, Name, Path, Ranking) VALUES ($1,'Home','',0)", webId)
	if err != nil {
		return 0, err
	}
	return webId, nil
}

func SaveArticle(webId int, article models.ArticleModel) (*models.ArticleModel, error) { // single article
	var id int
	article.Date = time.Now()
	err := db.Context.QueryRow("INSERT INTO articles (WebId,Title,Date,Content) values ($1,$2,$3,$4) RETURNING Id", webId, article.Title, article.Date, article.Content).Scan(&id)
	if err != nil {
		return nil, err
	}
	article.Id = id
	return &article, nil
}

func SaveRecruitment(webId int, recruits []models.RecruitmentModel) ([]models.RecruitmentModel, error) {
	if len(recruits) == 0 {
		return nil, nil
	}

	numberOfRows := len(recruits)
	var values string
	for i := 0; i < numberOfRows; i++ {
		values += fmt.Sprintf("($%d,$%d,ARRAY[$%d]),", (i*3)+1, (i*3)+2, (i*3)+3)
	}
	values = values[:len(values)-2]
	fmt.Println(values)

	params := make([]interface{}, 0, len(recruits)*3)

	for _, item := range recruits {
		params = append(params, webId, item.Class, pq.Array(item.Subclasses))
	}

	query := "INSERT INTO recruitment (WebId, Class, Subclass) VALUES " + values + ""
	_, err := db.Context.Exec(query, params...)
	if err != nil {
		return nil, err
	}
	recruitsObject, err := getRecruitment(webId)
	if err != nil {
		return nil, err
	}
	return recruitsObject, nil
}

func SaveNavbar(webId int, navbar []models.NavItem) ([]models.NavItem, error) {
	if len(navbar) == 0 {
		return nil, nil
	}

	values := GetValueString(len(navbar), 4)
	params := make([]interface{}, 0, len(navbar)*4)

	for i, item := range navbar {
		params = append(params, webId, item.Name, item.Path, i)
	}

	query := "INSERT INTO navbar (WebId, Name, Path, Ranking) VALUES " + values
	_, err := db.Context.Exec(query, params...)
	if err != nil {
		return nil, err
	}
	navbarObject, err := getNavbar(webId)
	if err != nil {
		return nil, err
	}
	return navbarObject, nil
}

func SaveChannels(webId int, channel []models.ChannelModel, site string) ([]models.ChannelModel, error) {
	if len(channel) == 0 {
		return nil, nil
	}
	numberOfData := 4
	values := GetValueString(len(channel), numberOfData)
	params := make([]interface{}, 0, len(channel)*numberOfData)

	for _, item := range channel {
		params = append(params, webId, site, item.Name, item.Link)
	}

	query := "INSERT INTO channels (WebId, Type, Name, Link) VALUES " + values
	_, err := db.Context.Exec(query, params...)
	if err != nil {
		return nil, err
	}
	youtubeObject, twitchObject, err := getChannels(webId)
	if err != nil {
		return nil, err
	}
	if site == "youtbe" {
		return youtubeObject, nil
	} else {

		return twitchObject, nil
	}
}

func SaveProgress(webId int, progess []models.ProgressModel) ([]models.ProgressModel, error) {
	if len(progess) == 0 {
		return nil, nil
	}

	//transaciot because we insert to multiple tables
	tx, commitOrRollback, err := db.BeginTransaction()
	if err != nil {
		return nil, nil
	}
	defer commitOrRollback()

	for _, item := range progess {

		//params = append(params, webId, item.Name, item.Path, item.Order)
		var progressId int
		err := tx.QueryRow("INSERT INTO progress (WebId,Name) values ($1,$2) RETURNING  Id", webId, item.Name).Scan(&progressId)
		if err != nil {
			return nil, err
		}
		values := GetValueString(len(item.Raids), 3)

		params := make([]interface{}, 0, len(item.Raids)*3)
		for _, item := range item.Raids {
			params = append(params, progressId, item.Difficulty, item.Max, item.Current)
		}

		query := "INSERT INTO raids (ProgressId,Difficulty,Maz,Current) VALUES " + values
		//err := tx.QueryRow("INSERT INTO raids (ProgressId,Difficulty,Maz,Current) values ($1,$2) RETURNING  Id", webId, item.Name).Scan(&progressId)
		_, err = tx.Exec(query, params...)
		if err != nil {
			return nil, err
		}
	}
	progressObject, err := getProgress(webId)
	if err != nil {
		return nil, err
	}
	return progressObject, nil
}

func SaveCalendar(webId int, calendar []models.CalendarModel) ([]models.CalendarModel, error) {
	if len(calendar) == 0 {
		return nil, nil
	}
	numberOfData := 4
	values := GetValueString(len(calendar), numberOfData)
	params := make([]interface{}, 0, len(calendar)*numberOfData)

	for _, item := range calendar {
		params = append(params, webId, item.Name, item.Date, item.Type)
	}

	query := "INSERT INTO calendar (WebId, Name, Date, Type) VALUES " + values
	_, err := db.Context.Exec(query, params...)
	if err != nil {
		return nil, err
	}
	calendarObject, err := getCalendar(webId)
	if err != nil {
		return nil, err
	}
	return calendarObject, nil
}

func GetValueString(numberOfRows int, numberOfData int) string {
	//($1, $2, $3, $4, $5), ($6, $7, $8, $9, $10)
	var result string
	for i := 0; i < numberOfRows; i++ {
		result += "("
		for j := 0; j < numberOfData; j++ {
			result += fmt.Sprint("$" + strconv.Itoa((i*numberOfData)+j+1) + ", ")
		}
		result = result[:len(result)-2]
		result += "), "
	}
	result = result[:len(result)-2]
	fmt.Println(result)
	return result
}
