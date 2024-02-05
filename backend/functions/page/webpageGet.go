package page

import (
	db "ProjectAlpha/DB"
	ChannelType "ProjectAlpha/enums/channelEnum"
	ImageType "ProjectAlpha/enums/imageTypeEmum.go"
	"ProjectAlpha/functions/file"
	"ProjectAlpha/models"
	"fmt"

	"github.com/lib/pq"
)

func GetWebContent(webId int) (*models.WebPageModel, error) {
	fmt.Println(webId)
	result := models.WebPageModel{}
	//Title and Preset Id
	row := db.Context.QueryRow("SELECT Name, Template_Id FROM webpages WHERE id=$1", webId)
	err := row.Scan(&result.Title, &result.TemplateId)

	if err != nil {
		return nil, err
	}

	//logo
	logo, err := file.GetFile(webId, ImageType.LOGO, webId)
	if err != nil {
		fmt.Println("Logo get: " + err.Error())
	}

	result.Logo = logo

	//banner
	banner, err := file.GetFile(webId, ImageType.BANNER, webId)
	if err != nil {
		fmt.Println("Banner get: " + err.Error())
	}
	result.Banner = banner

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

	//rules
	rules, err := getRules(webId)
	if err != nil {
		fmt.Println("Rules get: " + err.Error())
	}
	result.Rules = rules
	return &result, nil
}

func getArticles(webId int) ([]models.ArticleModel, error) {
	var result []models.ArticleModel = make([]models.ArticleModel, 0)
	rows, err := db.Context.Query("SELECT Id, Title, Date, Content FROM articles WHERE WebId=$1 ORDER BY Date DESC", webId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var article models.ArticleModel
		err = rows.Scan(&article.Id, &article.Title, &article.Date, &article.Content)
		if err != nil {
			return nil, err
		}
		result = append(result, article)
	}
	return result, nil
}
func getRecruitment(webId int) ([]models.RecruitmentModel, error) {
	var result []models.RecruitmentModel = make([]models.RecruitmentModel, 0)
	rows, err := db.Context.Query("SELECT Id, Class, Subclass FROM recruitment WHERE WebId=$1", webId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var r models.RecruitmentModel
		var subclasses pq.StringArray

		err = rows.Scan(&r.Id, &r.Class, &subclasses)
		if err != nil {
			return nil, err
		}
		r.Subclasses = []string(subclasses)
		result = append(result, r)
	}
	return result, nil
}

func getNavbar(webId int) ([]models.NavItem, error) {
	var result []models.NavItem = make([]models.NavItem, 0)
	rows, err := db.Context.Query("SELECT Id, Name, Path, Enabled FROM navbar WHERE WebId=$1 ORDER BY Ranking", webId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var navbar models.NavItem
		err = rows.Scan(&navbar.Id, &navbar.Name, &navbar.Path, &navbar.IsEnabled)
		if err != nil {
			return nil, err
		}
		result = append(result, navbar)
	}
	return result, nil
}
func getChannels(webId int) ([]models.ChannelModel, []models.ChannelModel, error) { //return: youtube, twitch, error
	var youtube []models.ChannelModel = make([]models.ChannelModel, 0)
	var twitch []models.ChannelModel = make([]models.ChannelModel, 0)
	rows, err := db.Context.Query("SELECT Id, Type, Name, Link FROM channels WHERE WebId=$1", webId)
	if err != nil {
		return nil, nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var ctype string
		var channel models.ChannelModel
		err = rows.Scan(&channel.Id, &ctype, &channel.Name, &channel.Link)
		if err != nil {
			return nil, nil, err
		}
		if ctype == ChannelType.YOUTUBE {
			youtube = append(youtube, channel)
		} else if ctype == ChannelType.TWITCH {
			twitch = append(twitch, channel)
		}

	}
	return youtube, twitch, nil
}
func getProgress(webId int) ([]models.ProgressModel, error) {
	var result []models.ProgressModel = make([]models.ProgressModel, 0)
	rows, err := db.Context.Query("SELECT Id, Name FROM progress WHERE WebId=$1", webId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var progress models.ProgressModel
		progress.Raids = make([]models.RaidModel, 0)
		err = rows.Scan(&progress.Id, &progress.Name)
		if err != nil {
			return nil, err
		}
		raids, err := db.Context.Query("SELECT Id, Difficulty, Max, Current FROM raids WHERE Progress_Id=$1", progress.Id)
		if err != nil {
			return nil, err
		}
		defer raids.Close()
		for raids.Next() {
			var raid models.RaidModel
			err = raids.Scan(&raid.Id, &raid.Difficulty, &raid.Max, &raid.Current)
			if err != nil {
				return nil, err
			}
			progress.Raids = append(progress.Raids, raid)
		}
		result = append(result, progress)
	}
	return result, nil
}
func getCalendar(webId int) ([]models.CalendarModel, error) {
	var result []models.CalendarModel = make([]models.CalendarModel, 0)
	rows, err := db.Context.Query("SELECT Id, Name, Date, Type FROM calendar WHERE WebId=$1 ORDER BY Date", webId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var calendar models.CalendarModel
		err = rows.Scan(&calendar.Id, &calendar.Name, &calendar.Date, &calendar.Type)
		if err != nil {
			return nil, err
		}
		result = append(result, calendar)
	}
	return result, nil
}

func getRules(webId int) ([]models.RulesModel, error) {
	var result []models.RulesModel = make([]models.RulesModel, 0)
	rows, err := db.Context.Query("SELECT Id, Rule FROM rules WHERE WebId=$1", webId)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		var rule models.RulesModel
		err = rows.Scan(&rule.Id, &rule.Rule)
		if err != nil {
			return nil, err
		}
		result = append(result, rule)
	}
	return result, nil
}
