import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { AdminComponent } from './components/admin/admin.component';
import { HomeComponent } from './components/home/home.component';
import { RulesComponent } from './components/rules/rules.component';
import { PreviewComponent } from './components/preview/preview.component';

export const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'admin', component: AdminComponent, canActivate: [authGuard]},
    { path: 'rules', component: RulesComponent },
    { path: 'preview', component: PreviewComponent },
    { path: '**', redirectTo: '/'}
];
