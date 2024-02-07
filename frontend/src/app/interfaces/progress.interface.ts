import { Raid } from "./raid.interface"

export interface Progress {
    id: number
    name: string
    raids: Raid[]
    background: string
}