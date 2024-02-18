import { Recruitment } from "../../interfaces/recruitment.interface";
import { TemplateOneAboutComponent } from "./templates/template-one/template-one-about/template-one-about.component";
import { TemplateOneComponent } from "./templates/template-one/template-one/template-one.component";
import { TemplateTwoComponent } from "./templates/template-two/template-two/template-two.component";

export interface Template {
    name: string
    image: string
    '': any
    about: any
    rules: any
    videos: any
    tactics: any
}

// ALL USABLE TEMPLATES MUST BE INCLUDED
export const TEMPLATES: Template[] = [
    {
        name: 'Template 1',
        image: 'https://via.placeholder.com/640x360',
        '': TemplateOneComponent,
        'about': TemplateOneAboutComponent,
        'rules': TemplateOneAboutComponent,
        'videos': TemplateOneAboutComponent,
        'tactics': TemplateOneAboutComponent,
    },
    {
        name: 'Template 2',
        image: 'https://via.placeholder.com/640x360',
        '': TemplateTwoComponent,
        'about': TemplateOneAboutComponent,
        'rules': TemplateOneAboutComponent,
        'videos': TemplateOneAboutComponent,
        'tactics': TemplateOneAboutComponent,
    },
    {
        name: 'Template 3',
        image: 'https://via.placeholder.com/640x360',
        '': TemplateTwoComponent,
        'about': TemplateOneAboutComponent,
        'rules': TemplateOneAboutComponent,
        'videos': TemplateOneAboutComponent,
        'tactics': TemplateOneAboutComponent,
    },
]

/* classImages: [
            "https://wow.zamimg.com/images/wow/icons/large/classicon_warrior.jpg",
            "https://wow.zamimg.com/images/wow/icons/large/classicon_druid.jpg",
            "https://wow.zamimg.com/images/wow/icons/large/classicon_monk.jpg",
            "https://wow.zamimg.com/images/wow/icons/large/classicon_hunter.jpg",
            "https://wow.zamimg.com/images/wow/icons/large/classicon_mage.jpg",
            "https://wow.zamimg.com/images/wow/icons/large/classicon_demonhunter.jpg",
            "https://wow.zamimg.com/images/wow/icons/large/classicon_deathknight.jpg",
            "https://wow.zamimg.com/images/wow/icons/large/classicon_shaman.jpg",
            "https://wow.zamimg.com/images/wow/icons/large/classicon_warlock.jpg",
            "https://wow.zamimg.com/images/wow/icons/large/classicon_rogue.jpg",
            "https://wow.zamimg.com/images/wow/icons/large/classicon_evoker.jpg"
        ], */

export interface Preset {
    name: string
    image: string
    logoImages: string[]
    backgroundImages: string[]
    classes: Recruitment[]
}

export const PRESETS: Preset[] = [
    {
        name: 'World of Warcraft: Dragonflight',
        image: 'https://logos-world.net/wp-content/uploads/2021/03/World-of-Warcraft-Logo.png',
        backgroundImages: ['https://logos-world.net/wp-content/uploads/2021/03/World-of-Warcraft-Logo.png', 'https://logos-world.net/wp-content/uploads/2021/03/World-of-Warcraft-Logo.png'],
        logoImages: ['https://logos-world.net/wp-content/uploads/2021/03/World-of-Warcraft-Logo.png', 'https://logos-world.net/wp-content/uploads/2021/03/World-of-Warcraft-Logo.png'],
        classes: [
            {
                id: 0,
                class: "https://wow.zamimg.com/images/wow/icons/large/classicon_evoker.jpg",
                subclasses: [
                    "https://wow.zamimg.com/images/wow/icons/medium/classicon_evoker_devastation.jpg",
                    "https://wow.zamimg.com/images/wow/icons/medium/classicon_evoker_preservation.jpg",
                    "https://wow.zamimg.com/images/wow/icons/medium/classicon_evoker_augmentation.jpg",
                ],
            },
            {
                id: 1,
                class: "https://wow.zamimg.com/images/wow/icons/large/classicon_monk.jpg",
                subclasses: [
                    "https://wow.zamimg.com/images/wow/icons/medium/spell_monk_windwalker_spec.jpg",
                    "https://wow.zamimg.com/images/wow/icons/medium/spell_monk_mistweaver_spec.jpg",
                    "https://wow.zamimg.com/images/wow/icons/medium/spell_monk_brewmaster_spec.jpg",
                ],
            },
            {
                id: 2,
                class: "https://wow.zamimg.com/images/wow/icons/large/classicon_druid.jpg",
                subclasses: [
                    "https://wow.zamimg.com/images/wow/icons/medium/spell_nature_starfall.jpg",
                    "https://wow.zamimg.com/images/wow/icons/medium/spell_nature_healingtouch.jpg",
                    "https://wow.zamimg.com/images/wow/icons/medium/ability_druid_catform.jpg",
                    "https://wow.zamimg.com/images/wow/icons/medium/ability_racial_bearform.jpg",
                ],
            },
        ],
    },
    {
        name: 'World of Warcraft: Mists of Pandaria',
        image: 'https://i.imgur.com/YZMLxmj.png',
        backgroundImages: ['https://i.imgur.com/YZMLxmj.png','https://i.imgur.com/YZMLxmj.png'],
        logoImages: ['https://i.imgur.com/YZMLxmj.png','https://i.imgur.com/YZMLxmj.png'],
        classes: [
            {
                id: 0,
                class: "https://wow.zamimg.com/images/wow/icons/large/classicon_monk.jpg",
                subclasses: [
                    "https://wow.zamimg.com/images/wow/icons/medium/spell_monk_windwalker_spec.jpg",
                    "https://wow.zamimg.com/images/wow/icons/medium/spell_monk_mistweaver_spec.jpg",
                    "https://wow.zamimg.com/images/wow/icons/medium/spell_monk_brewmaster_spec.jpg",
                ],
            },
        ],
    },
    {
        name: 'World of Warcraft: Classic',
        image: 'https://wow.zamimg.com/uploads/blog/images/27174.png',
        backgroundImages: ['https://wow.zamimg.com/uploads/blog/images/27174.png','https://wow.zamimg.com/uploads/blog/images/27174.png'],
        logoImages: ['https://wow.zamimg.com/uploads/blog/images/27174.png','https://wow.zamimg.com/uploads/blog/images/27174.png'],
        classes: [
            {
                id: 1,
                class: "https://wow.zamimg.com/images/wow/icons/large/classicon_druid.jpg",
                subclasses: [
                    "https://wow.zamimg.com/images/wow/icons/medium/spell_nature_starfall.jpg",
                    "https://wow.zamimg.com/images/wow/icons/medium/spell_nature_healingtouch.jpg",
                    "https://wow.zamimg.com/images/wow/icons/medium/ability_druid_catform.jpg",
                    "https://wow.zamimg.com/images/wow/icons/medium/ability_racial_bearform.jpg",
                ],
            },
        ],
    },
]