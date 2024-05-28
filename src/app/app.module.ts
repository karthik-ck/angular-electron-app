import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SiteHeaderComponent } from './_layouts/site-header/site-header.component';
import { SiteFooterComponent } from './_layouts/site-footer/site-footer.component';
import { SpinnerComponent } from './_layouts/spinner/spinner.component';
import { SidebarComponent } from './_layouts/sidebar/sidebar.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HomeModule } from './home/home.module';
import { DatePipe } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,HomeModule,
        DatePipe,
        ToastrModule.forRoot({
            timeOut: 2000,
            positionClass: 'toast-bottom-right',
            preventDuplicates: true,
        }),
    DragDropModule
  ],
  declarations: [
    AppComponent,
    //SiteHeaderComponent,
    //SiteFooterComponent,
    //SpinnerComponent,
    //SidebarComponent,
    //HomeComponent,
    //DashboardComponent,
    //LoginComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
