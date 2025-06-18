import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { AdminNewsFormComponent } from './admin-news-form/admin-news-form.component';
import { AdminNewsListComponent } from './admin-news-list/admin-news-list.component';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminNewsFormComponent,
    AdminNewsListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ]
})
export class AdminDashboardModule { } 