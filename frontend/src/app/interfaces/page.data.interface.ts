import { Article } from "./article.interface"
import { Calendar } from "./calendar.interface"
import { Channel } from "./channel.interface"
import { NavItem } from "./navitem.interface"
import { Progress } from "./progress.interface"
import { Recruitment } from "./recruitment.interface"

export interface PageData {
    title: string
    templateid: number
    presetid: number
    logo: string
    banner: string
    customcss: string
    articles: Article[]
    recruitment: Recruitment[]
    navbar: NavItem[]
    channels: Channel[]
    progress: Progress[]
    calendar: Calendar[]
    rules: string
}