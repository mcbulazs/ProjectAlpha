package models

type WebPageModel struct {
	Title       string             `json:"title"`
	TemplateId  int                `json:"templateid"`
	PresetId    int                `json:"presetid"`
	Logo        string             `json:"logo"`
	Banner      string             `json:"banner"`
	CustomCss   string             `json:"customcss"`
	Articles    []ArticleModel     `json:"articles"`    //[{"content": "asdas<span style=\"color:red\">dasd</span>", "date": "2015-07-19T15.23.32.000Z", "title": "asd"}]
	Recruitment []RecruitmentModel `json:"recruitment"` //[{"class": "dk", "subclass": ["asd", "csa"]}]
	Navbar      []NavItem          `json:"navbar"`      //[{"name": "Aboutasd", "path": "about","order":1}]
	Twitch      []ChannelModel     `json:"twitch"`      //[{"link": "twitch.tv/asd", "name": "cs.ttv"}]
	Youtube     []ChannelModel     `json:"youtube"`     //[{"link": "twitch.tv/asd", "name": "cs.ttv"}]
	Progress    []ProgressModel    `json:"progress"`    //[{"raidname":"asd","raids":[{"difficulty":"hc","max":9,"current":5}]}]
	Calendar    []CalendarModel    `json:"calendar"`    //[{"date": "2000-10-31T01:30:00.000Z", "description": "Lorem ipsum dolor sit amet.", "name": "event", "type": "raid"}]
	Rules       []RulesModel       `json:"rules"`       //[{"id":2,"rule":"asdasdsa"},{"id":3,"rule":"ascacs"}]
}
