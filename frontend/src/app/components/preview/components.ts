import { TemplateOneAboutComponent } from "./templates/template-one/template-one-about/template-one-about.component";
import { TemplateOneComponent } from "./templates/template-one/template-one/template-one.component";
import { TemplateTwoComponent } from "./templates/template-two/template-two/template-two.component";

// ALL USABLE TEMPLATES MUST BE INCLUDED
export const TEMPLATES: any = [
    {
        name: 'Template 1',
        image: 'https://via.placeholder.com/640x360',
        '': TemplateOneComponent,
        'about': TemplateOneAboutComponent,
    },
    {
        name: 'Template 2',
        image: 'https://via.placeholder.com/640x360',
        '': TemplateTwoComponent,
        'about': TemplateTwoComponent,
    },
    {
        name: 'Template 3',
        image: 'https://via.placeholder.com/640x360',
        '': TemplateTwoComponent,
        'about': TemplateTwoComponent,
    },
]