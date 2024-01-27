import { Article } from "./article.interface"
import { Calendar } from "./calendar.interface"
import { Channel } from "./channel.interface"
import { FileModel } from "./filemodel.interface"
import { NavItem } from "./navbar.interface"
import { Progress } from "./progress.interface"
import { Recruitment } from "./recruitment.interface"

export interface PageData {
    title: string
    presetId: number
    logo: FileModel
    banner: FileModel
    articles: Article[]
    recruitment: Recruitment[]
    navbar: NavItem[]
    twitch: Channel[]
    youtube: Channel[]
    progress: Progress[]
    calendar: Calendar[]
}