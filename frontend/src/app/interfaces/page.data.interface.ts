import { Article } from "./article.interface"
import { Calendar } from "./calendar.interface"
import { Channel } from "./channel.interface"
import { NavItem } from "./navbar.interface"
import { Progress } from "./progress.interface"
import { Recruitment } from "./recruitment.interface"

export interface PageData {
    title: string
    templateid: number
    logo: string
    banner: string
    articles: Article[]
    recruitment: Recruitment[]
    navbar: NavItem[]
    twitch: Channel[]
    youtube: Channel[]
    progress: Progress[]
    calendar: Calendar[]
    backgroundColor: string
}