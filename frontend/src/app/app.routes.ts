import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { AdminComponent } from './components/admin/admin.component';
import { HomeComponent } from './components/home/home.component';
import { RulesComponent } from './components/rules/rules.component';
import { homeGuard } from './guards/home.guard';
import { GeneralComponent } from './components/admin/general/general.component';
import { ArticlesComponent } from './components/admin/articles/articles.component';
import { RecruitmentComponent } from './components/admin/recruitment/recruitment.component';
import { ProgressComponent } from './components/admin/progress/progress.component';
import { TemplatesComponent } from './components/admin/templates/templates.component';
import { MediaComponent } from './components/admin/media/media.component';
import { CalendarComponent } from './components/admin/calendar/calendar.component';
import { DangerZoneComponent } from './components/admin/danger-zone/danger-zone.component';
import { GuildRulesComponent } from './components/admin/guild-rules/guild-rules.component';
import { UploadsComponent } from './components/admin/uploads/uploads.component';
import { saveBeforeLeaveGuard } from './guards/save-before-leave.guard';
import { NavigationComponent } from './components/admin/navigation/navigation.component';

export const PROJECT_TITLE = 'Project';

export const routes: Routes = [
    { path: '', component: HomeComponent, title: `${PROJECT_TITLE} | Home`, canActivate: [homeGuard], pathMatch: 'full' },
    { path: 'admin', component: AdminComponent, canActivate: [authGuard], title: `${PROJECT_TITLE} | Admin`, children: [
        { path: 'general', component: GeneralComponent, canDeactivate: [saveBeforeLeaveGuard]},
        { path: 'pages', component: NavigationComponent, canDeactivate: [saveBeforeLeaveGuard] },
        { path: 'uploads', component: UploadsComponent },
        { path: 'templates', component: TemplatesComponent, },
        { path: 'articles', component: ArticlesComponent },
        { path: 'rules', component: GuildRulesComponent },
        { path: 'recruitment', component: RecruitmentComponent },
        { path: 'progress', component: ProgressComponent },
        { path: 'media', component: MediaComponent },
        { path: 'calendar', component: CalendarComponent },
        { path: 'settings', component: DangerZoneComponent },
        { path: '**', redirectTo: 'general' },
    ]},
    { path: 'rules', component: RulesComponent, title: `${PROJECT_TITLE} | Rules`},
    { path: '**', redirectTo: '/' },
];