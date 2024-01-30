import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { AdminComponent } from './components/admin/admin.component';
import { HomeComponent } from './components/home/home.component';
import { RulesComponent } from './components/rules/rules.component';
import { homeGuard } from './guards/home.guard';
import { GeneralComponent } from './components/admin/general/general.component';
import { ArticlesComponent } from './components/admin/articles/articles.component';
import { TemplateOneComponent } from './components/preview/templates/template-one/template-one/template-one.component';
import { TemplateOneAboutComponent } from './components/preview/templates/template-one/template-one-about/template-one-about.component';
import { RecruitmentComponent } from './components/admin/recruitment/recruitment.component';
import { ProgressComponent } from './components/admin/progress/progress.component';

export const PROJECT_TITLE = 'Project';

export const routes: Routes = [
    { path: '', component: HomeComponent, title: `${PROJECT_TITLE} | Home`, canActivate: [homeGuard] },
    { path: 'admin', component: AdminComponent, canActivate: [authGuard], title: `${PROJECT_TITLE} | Admin`, children: [
        { path: '', component: GeneralComponent },
        { path: 'articles', component: ArticlesComponent },
        { path: 'recruitment', component: RecruitmentComponent },
        { path: 'progress', component: ProgressComponent },
    ]} ,
    { path: 'rules', component: RulesComponent, title: `${PROJECT_TITLE} | Rules`},
    { path: '**', redirectTo: '/' },
];