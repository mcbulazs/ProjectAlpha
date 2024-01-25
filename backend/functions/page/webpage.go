package page

import (
	db "ProjectAlpha/DB"
	"ProjectAlpha/models"
	"database/sql"
	"fmt"
)

func CreateWebpage(userId int) (int, error) {
	var webId int
	row := db.Context.QueryRow("SELECT Id FROM webpages WHERE Owner_Id=$1", userId)

	err := row.Scan(&webId)
	if err == nil {
		return webId, nil
	} else if err != sql.ErrNoRows {
		return 0, err
	}

	err = db.Context.QueryRow("INSERT INTO webpages (Owner_Id) VALUES ($1) RETURNING Id", userId).Scan(&webId)
	if err != nil {
		return 0, err
	}
	if err != nil {
		return 0, err
	}
	return webId, nil
}

func GetWebContent(webId int) (*models.WebPageModel, error) {
	fmt.Println(webId)
	result := models.WebPageModel{}
	var Logo_Id int
	var Banner_ID int
	//Title and Preset Id
	row := db.Context.QueryRow("SELECT Name,Preset_Id,Logo_Id,Banner_ID FROM webpages WHERE id=$1", webId)
	err := row.Scan(&result.Title, &result.PresetId, &Logo_Id, &Banner_ID)

	if err != nil {
		return nil, err
	}
	//logo
	if Logo_Id != 0 {
		row = db.Context.QueryRow("SELECT Path FROM files WHERE id=$1", Logo_Id)
		err = row.Scan(&result.Logo)
		if err != nil {
			fmt.Println("Logo get: " + err.Error())
		}
	}
	//banner
	if Banner_ID != 0 {
		row = db.Context.QueryRow("SELECT Path FROM files WHERE id=$1", Banner_ID)
		err = row.Scan(&result.Banner)
		if err != nil {
			fmt.Println("Banner get: " + err.Error())
		}
	}
	//articles
	articles, err := getArticles(webId)
	if err != nil {
		fmt.Println("Articles get: " + err.Error())
	}
	result.Articles = articles
	//recruitment
	recruitment, err := getRecruitment(webId)

	if err != nil {
		fmt.Println("Recruitment get: " + err.Error())
	}
	result.Recruitment = recruitment

	//navbar
	navbar, err := getNavbar(webId)
	if err != nil {
		fmt.Println("Navbar get: " + err.Error())
	}
	result.Navbar = navbar

	//twitch / youtube
	youtube, twitch, err := getChannels(webId)
	if err != nil {
		fmt.Println("Channels get: " + err.Error())
	}
	result.Youtube = youtube
	result.Twitch = twitch
	//progress
	progess, err := getProgress(webId)
	if err != nil {
		fmt.Println("Progress get: " + err.Error())
	}
	result.Progress = progess

	//calendar
	calendar, err := getCalendar(webId)
	if err != nil {
		fmt.Println("Calendar get: " + err.Error())
	}
	result.Calendar = calendar
	return &result, nil
}

func getArticles(webId int) ([]models.ArticleModel, error) {
	var result []models.ArticleModel
	rows, err := db.Context.Query("SELECT Title,Date,Content FROM articles WHERE WebId=$1 ORDER BY Date", webId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var article *models.ArticleModel
		err = rows.Scan(&article.Title, &article.Date, &article.Content)
		if err != nil {
			return nil, err
		}
		result = append(result, *article)
	}
	return result, nil
}
func getRecruitment(webId int) ([]models.RecruitmentModel, error) {
	var result []models.RecruitmentModel
	rows, err := db.Context.Query("SELECT Class, Subclass FROM recruitment WHERE WebId=$1", webId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	recruits := make(map[string][]string)
	for rows.Next() {
		var class string
		var subclass string
		err = rows.Scan(&class, &subclass)
		if err != nil {
			return nil, err
		}
		recruits[class] = append(recruits[class], subclass)
	}
	for key, value := range recruits {
		var recs models.RecruitmentModel
		recs.Class = key
		recs.Subclasses = value
		result = append(result, recs)
	}
	return result, nil
}

func getNavbar(webId int) ([]models.Navbar, error) {
	var result []models.Navbar
	rows, err := db.Context.Query("SELECT Name, Path, Ranking FROM navbar WHERE WebId=$1 ORDER BY Ranking", webId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var navbar *models.Navbar
		err = rows.Scan(&navbar.Name, &navbar.Path, &navbar.Order)
		if err != nil {
			return nil, err
		}
		result = append(result, *navbar)
	}
	return result, nil
}
func getChannels(webId int) ([]models.ChannelModel, []models.ChannelModel, error) { //return: youtube, twitch, error
	var youtube []models.ChannelModel
	var twitch []models.ChannelModel
	rows, err := db.Context.Query("SELECT Type,Name,Link FROM channels WHERE WebId=$1", webId)
	if err != nil {
		return nil, nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var ctype string
		var channel *models.ChannelModel
		err = rows.Scan(&ctype, &channel.Name, &channel.Link)
		if err != nil {
			return nil, nil, err
		}
		if ctype == "youtube" {
			youtube = append(youtube, *channel)
		} else if ctype == "twitch" {
			twitch = append(twitch, *channel)
		}

	}
	return youtube, twitch, nil
}
func getProgress(webId int) ([]models.ProgressModel, error) {
	var result []models.ProgressModel
	rows, err := db.Context.Query("SELECT Id, Name FROM progress WHERE WebId=$1", webId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var progress *models.ProgressModel
		var progId int
		err = rows.Scan(&progId, &progress.Name)
		if err != nil {
			return nil, err
		}
		raids, err := db.Context.Query("SELECT Difficulty, Max, Current FROM raids WHERE Progress_Id=$1", progId)
		if err != nil {
			return nil, err
		}
		defer raids.Close()
		for raids.Next() {
			var raid *models.RaidModel
			err = raids.Scan(&raid.Difficulty, &raid.Max, &raid.Current)
			if err != nil {
				return nil, err
			}
			progress.Raids = append(progress.Raids, *raid)
		}
		result = append(result, *progress)
	}
	return result, nil
}
func getCalendar(webId int) ([]models.CalendarModel, error) {
	var result []models.CalendarModel
	rows, err := db.Context.Query("SELECT Name, Date, Type FROM calendar WHERE WebId=$1 ORDER BY Date", webId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var calendar *models.CalendarModel
		err = rows.Scan(&calendar.Name, &calendar.Date, &calendar.Type)
		if err != nil {
			return nil, err
		}
		result = append(result, *calendar)
	}
	return result, nil
}
