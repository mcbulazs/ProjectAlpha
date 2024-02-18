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

export interface Preset {
    name: string
    image: string
    logoImages: string[]
    backgroundImages: string[]
    classImages: string[]
    subclassImages: string[]
}

export const PRESETS: Preset[] = [
    {
        name: 'World of Warcraft: Dragonflight',
        image: 'https://logos-world.net/wp-content/uploads/2021/03/World-of-Warcraft-Logo.png',
        backgroundImages: ['https://logos-world.net/wp-content/uploads/2021/03/World-of-Warcraft-Logo.png', 'https://logos-world.net/wp-content/uploads/2021/03/World-of-Warcraft-Logo.png'],
        classImages: [],
        logoImages: ['https://logos-world.net/wp-content/uploads/2021/03/World-of-Warcraft-Logo.png', 'https://logos-world.net/wp-content/uploads/2021/03/World-of-Warcraft-Logo.png'],
        subclassImages: [],
    },
    {
        name: 'World of Warcraft: Mists of Pandaria',
        image: 'https://i.imgur.com/YZMLxmj.png',
        backgroundImages: ['https://i.imgur.com/YZMLxmj.png','https://i.imgur.com/YZMLxmj.png'],
        classImages: [],
        logoImages: ['https://i.imgur.com/YZMLxmj.png','https://i.imgur.com/YZMLxmj.png'],
        subclassImages: [],
    },
    {
        name: 'World of Warcraft: Classic',
        image: 'https://wow.zamimg.com/uploads/blog/images/27174.png',
        backgroundImages: ['https://wow.zamimg.com/uploads/blog/images/27174.png','https://wow.zamimg.com/uploads/blog/images/27174.png'],
        classImages: [],
        logoImages: ['https://wow.zamimg.com/uploads/blog/images/27174.png','https://wow.zamimg.com/uploads/blog/images/27174.png'],
        subclassImages: [],
    },
]