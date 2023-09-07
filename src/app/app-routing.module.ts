import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {Erreur404Component} from "./component/erreur404/erreur404.component";
import {AuthGuard} from "./_helpers/auth.guard";

const routes: Routes = [
  // Dashboard
  { path: 'dashboard', loadChildren: () => import('./component/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard]},
  // Login / Register
  { path: 'auth', loadChildren: () => import('./component/auth/auth.module').then(m => m.AuthModule) },
  // Users
  { path: 'users', loadChildren: () => import('./component/users/users.module').then(m => m.UsersModule), canActivate: [AuthGuard]},
  // Session
  { path: 'session', loadChildren: () => import('./component/session/session.module').then(m => m.SessionModule), canActivate: [AuthGuard]},
  // Seance
  { path: 'seance', loadChildren: () => import('./component/seance/seance.module').then(m => m.SeanceModule), canActivate: [AuthGuard]},
  // Mangwa
  { path: 'mangwa', loadChildren: () => import('./component/mangwa/mangwa.module').then(m => m.MangwaModule), canActivate: [AuthGuard]},
  // User Profile
  { path: 'profile', loadChildren: () => import('./component/profile/profile.module').then(m => m.ProfileModule), canActivate: [AuthGuard]},
  // Prêts
  { path: 'prets', loadChildren: () => import('./component/prets/prets.module').then(m => m.PretsModule), canActivate: [AuthGuard]},
  // Amande
  { path: 'amandes', loadChildren: () => import('./component/amande/amande.module').then(m => m.AmandeModule), canActivate: [AuthGuard]},
  // Discipline
  { path: 'discipline', loadChildren: () => import('./component/discipline/discipline.module').then(m => m.DisciplineModule), canActivate: [AuthGuard]},
  // Page not found
  { path: 'pageNotFound', component: Erreur404Component },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  { path: '**', redirectTo: '/pageNotFound'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
