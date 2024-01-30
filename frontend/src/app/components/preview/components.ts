import { TemplateOneAboutComponent } from "./templates/template-one/template-one-about/template-one-about.component";
import { TemplateOneComponent } from "./templates/template-one/template-one/template-one.component";
import { TemplateTwoComponent } from "./templates/template-two/template-two/template-two.component";

// ALL USABLE TEMPLATES MUST BE INCLUDED
export const TEMPLATES: any = [
    {
        '': TemplateOneComponent,
        'about': TemplateOneAboutComponent,
    },
    {
        '': TemplateTwoComponent,
        'about': TemplateTwoComponent,
    },
]