import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HomeRoutingModule } from './home-routing.module';
import { SiteHeaderComponent } from '../_layouts/site-header/site-header.component';
import { SiteFooterComponent } from '../_layouts/site-footer/site-footer.component';
import { SidebarComponent } from '../_layouts/sidebar/sidebar.component';
import { SpinnerComponent } from '../_layouts/spinner/spinner.component';


@NgModule({
  declarations: [HomeComponent,SiteHeaderComponent,SiteFooterComponent,SidebarComponent,SpinnerComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ],
  exports: [SiteHeaderComponent,SiteFooterComponent,SidebarComponent,SpinnerComponent],
})
export class HomeModule { }
