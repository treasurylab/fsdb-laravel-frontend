import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SpinnerInterceptor } from './core/interceptors/spinner.interceptor';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { PlatformModule } from '@angular/cdk/platform';
//For Auth
import { environment } from 'src/environments';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
//For Material themes
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatSliderModule } from '@angular/material/slider';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSortModule } from '@angular/material/sort';

//Normal imports
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './features/login-module/login-page.component';
import { PhoneSliderComponent } from './features/login-module/components/phone-slider/phone-slider.component';
import { DashboardPageComponent } from './features/dashboard-module/dashboard-page.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotFoundPageComponent } from './core/components/not-found-page/not-found-page.component';

import { SpinnerComponent } from './core/components/spinner/spinner.component';
import { DummyComponentComponent } from './core/components/dummy-component/dummy-component.component';
import { InformationDialogComponent } from './core/components/information-dialog/information-dialog.component';
import { CommonModule, DatePipe } from '@angular/common';
import { LayoutModule } from '@angular/cdk/layout';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ExpiredSchemeFilterPipe } from './pipes/dashboard/expired-scheme-filter.pipe';
// MF Pages

import { MappedClassIdFilterPipe } from './pipes/mutual-funds/mapped-class-id/mapped-class-id-filter.pipe';
import { LogInfoFilterPipe } from './pipes/mutual-funds/mapped-class-id/log-info-filter.pipe';
import { StatusFilterPipe } from './pipes/mutual-funds/mapped-class-id/status-filter.pipe';
import { AumListFilterPipe } from './pipes/mutual-funds/portfolio-aum/aum-list-filter.pipe';
import { LandingpageComponent } from './features/landingpage/landingpage.component';

import { CustomDateFormatPipe } from './pipes/equity/date-format.pipe';
import { CompanyFilterPipe } from './pipes/equity/company-filter.pipe';
import { SharedModule } from './shared/shared.module';

import { MatChipsModule } from '@angular/material/chips';
import { NgOptimizedImage } from '@angular/common';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { WidgetDemoComponent } from './features/widget-demo/widget-demo.component';
import { MenuBuilderComponent } from './features/dashboard-module/components/menu-components/menu-builder/menu-builder.component';
import { MenuTileComponent } from './features/dashboard-module/components/menu-components/menu-tile/menu-tile.component';
import { MenuExpansionComponent } from './features/dashboard-module/components/menu-components/menu-expansion/menu-expansion.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { UserProfileComponent } from './features/dashboard-module/components/user-profile/user-profile.component';
import { TokenInterceptor } from './core/interceptors/token.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    PhoneSliderComponent,
    DashboardPageComponent,
    NotFoundPageComponent,
    SpinnerComponent,
    DummyComponentComponent,
    InformationDialogComponent,
    ExpiredSchemeFilterPipe,
    MappedClassIdFilterPipe,
    LogInfoFilterPipe,
    StatusFilterPipe,
    AumListFilterPipe,
    LandingpageComponent,
    CustomDateFormatPipe,
    CompanyFilterPipe,
    WidgetDemoComponent,
    MenuBuilderComponent,
    MenuTileComponent,
    MenuExpansionComponent,
    UserProfileComponent,
  ],
  providers: [
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SpinnerInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent],
  imports: [
    NgOptimizedImage,
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    // FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    PlatformModule,
    //MAterial Imports
    MatAutocompleteModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatExpansionModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule,
    MatTableModule,
    MatCheckboxModule,
    MatCardModule,
    MatDatepickerModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatTabsModule,
    MatSortModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSliderModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatPaginator,
    //Graph modules
    CommonModule,
    MatGridListModule,
    LayoutModule,

    // FontAwesome Module
    FontAwesomeModule,
    MatChipsModule,
    SharedModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
