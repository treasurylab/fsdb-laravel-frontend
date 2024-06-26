import { RedirectUnauthorizedToLogin } from './core/services/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardPageComponent } from './features/dashboard-module/dashboard-page.component';
import { LoginPageComponent } from './features/login-module/login-page.component';
import { CommonModule } from '@angular/common';
import { LandingpageComponent } from './features/landingpage/landingpage.component';
import { WidgetDemoComponent } from './features/widget-demo/widget-demo.component';
//Auth Guard Routes
const routes: Routes = [
  {
    path: '',
    component: LandingpageComponent,
    pathMatch: 'full',
    canActivate: [],
  },
  {
    path: 'login',
    component: LoginPageComponent,
    pathMatch: 'full',
    canActivate: [],
  },
  //Debug purposes only
  {
    path: 'demo',
    component: WidgetDemoComponent,
    pathMatch: 'full',
    canActivate: [],
  },
  {
    path: 'app',
    component: DashboardPageComponent,
    //check guard here - RedirectAuthToLogin;
    canActivate: [RedirectUnauthorizedToLogin],
    children: [
      {
        path: '',
        redirectTo: 'default',
        pathMatch: 'full',
      },
      {
        path: 'exchange-rates',
        loadChildren: () =>
          import('./features/fxrates/fxrates.module').then(
            (m) => m.FXRatesModule
          ),
      },

      {
        path: 'interest-rates',
        loadChildren: () =>
          import('./features/interest-rates/interest-rates.module').then(
            (m) => m.InterestRatesModule
          ),
      },
      {
        path: 'securities',
        loadChildren: () =>
          import('./features/securities/securities.module').then(
            (m) => m.SecuritiesModule
          ),
      },
      {
        path: 'user',
        loadChildren: () =>
          import('./features/user/user.module').then((m) => m.UserModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true }), CommonModule],

  exports: [RouterModule],
})
export class AppRoutingModule {}
