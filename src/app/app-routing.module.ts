import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './_helpers/auth.guard';

const loginModule = () => import('./login/login.module').then(x => x.LoginModule);
const dashboardModule = () => import('./dashboard/dashboard.module').then(x => x.DashboardModule);

const routes: Routes = [
  { path: 'login', loadChildren: loginModule},
  // { path: 'dashboard', loadChildren: dashboardModule,canActivate: [AuthGuard]},
  { path: 'dashboard', loadChildren: dashboardModule },

  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
