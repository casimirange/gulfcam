import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {Erreur404Component} from "./component/erreur404/erreur404.component";
import {AuthGuard} from "./_helpers/auth.guard";

const routes: Routes = [
  // Dashboard
  // { path: '', loadChildren: () => import('./component/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard]},
  // Dashboard
  { path: 'dashboard', loadChildren: () => import('./component/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard]},
  // Type de bon
  { path: 'typeBon', loadChildren: () => import('./component/type-bon/type-bon.module').then(m => m.TypeBonModule), canActivate: [AuthGuard] },
  // Login / Register
  { path: 'auth', loadChildren: () => import('./component/auth/auth.module').then(m => m.AuthModule) },
  // Magasin
  { path: 'magasins', loadChildren: () => import('./component/magasin/magasin.module').then(m => m.MagasinModule), canActivate: [AuthGuard] },
  // Magasin
  { path: 'stations', loadChildren: () => import('./component/station/station.module').then(m => m.StationModule), canActivate: [AuthGuard] },
  // Caisse
  { path: 'caisse', loadChildren: () => import('./component/caisse/caisse.module').then(m => m.CaisseModule), canActivate: [AuthGuard]},
  // Note de credit
  { path: 'credit-note', loadChildren: () => import('./component/creditNote/credit-note.module').then(m => m.CreditNoteModule), canActivate: [AuthGuard]},
  // Demande d'opposition
  { path: 'request-opposition', loadChildren: () => import('./component/opposition/opposition.module').then(m => m.OppositionModule), canActivate: [AuthGuard]},
  // Command
  { path: 'commandes', loadChildren: () => import('./component/commande/commande.module').then(m => m.CommandeModule), canActivate: [AuthGuard]},
  // Client
  { path: 'clients', loadChildren: () => import('./component/client/client.module').then(m => m.ClientModule), canActivate: [AuthGuard]},
  // Users
  { path: 'users', loadChildren: () => import('./component/users/users.module').then(m => m.UsersModule), canActivate: [AuthGuard]},
  // Paiement Method
  { path: 'paiement-method', loadChildren: () => import('./component/paiement-method/paiement-method.module').then(m => m.PaiementMethodModule), canActivate: [AuthGuard]},
  // Entrepot
  { path: 'entrepots', loadChildren: () => import('./component/entrepot/entrepot.module').then(m => m.EntrepotModule), canActivate: [AuthGuard]},
  // Cartons
  { path: 'cartons', loadChildren: () => import('./component/cartons/cartons.module').then(m => m.CartonsModule), canActivate: [AuthGuard]},
  // Carnets
  { path: 'carnets', loadChildren: () => import('./component/carnets/carnets.module').then(m => m.CarnetsModule), canActivate: [AuthGuard]},
  // Coupons
  { path: 'coupons', loadChildren: () => import('./component/coupons/coupons.module').then(m => m.CouponsModule), canActivate: [AuthGuard]},
  // Mouvement de stock
  { path: 'stock', loadChildren: () => import('./component/mvt-stock/mvt-stock.module').then(m => m.MvtStockModule), canActivate: [AuthGuard]},
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
