import { TemplateOneAboutComponent } from "./templates/template-one/template-one-about/template-one-about.component";
import { TemplateOneComponent } from "./templates/template-one/template-one/template-one.component";
import { TemplateTwoComponent } from "./templates/template-two/template-two/template-two.component";
import { TemplateComponent } from "./templates/template/template.component";

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