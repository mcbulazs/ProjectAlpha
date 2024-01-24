package models

type WebPageModel struct {
	Title  string `json:"title"`
	Logo   string `json:"logo"`
	Banner string `json:"banner"`
	//TODO: replace any with actual types
	Articles    []ArticleModel     `json:"articles"`    //[{"content": "asdas<span style=\"color:red\">dasd</span>", "date": "2015-07-19T15.23.32.000Z", "title": "asd"}]
	Recruitment []RecruitmentModel `json:"recruitment"` //[{"class": "dk", "subclass": ["asd", "csa"]}]
	Navbar      []navbar           `json:"navbar"`      //[{"name": "Aboutasd", "path": "about"}]
	Twitch      []ChannelModel     `json:"twitch"`      //[{"link": "twitch.tv/asd", "name": "cs.ttv"}]
	Youtube     []ChannelModel     `json:"youtube"`     //[{"link": "twitch.tv/asd", "name": "cs.ttv"}]
	Progress    []ProgressModel    `json:"progress"`    //[{"raidname":"asd","difficulties":[{"difficulty":"hc","max":9,"curr":5}]}]
	Calendar    []calendarModel    `json:"calendar"`    //[{"date": "2000-10-31T01:30:00.000Z", "description": "Lorem ipsum dolor sit amet.", "name": "event", "type": "raid"}]

}