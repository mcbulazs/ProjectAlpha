import { Article } from "./article.interface"
import { RaidProgress } from "./raidprogress.interface"

export interface Data {
    sitename: string
    component: number
    menu: any[]
    articles: Article[]
    twitch: string
    logo: string
    tgf: string[]
    banner: string
    progress: RaidProgress[]
}