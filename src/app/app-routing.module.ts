import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminNewsFormComponent } from './admin-dashboard/admin-news-form/admin-news-form.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthService } from './Services/auth.service';
import { NewsDetailsComponent } from './home/news-details/news-details.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'news/:id', component: NewsDetailsComponent },
  { 
    path: 'admin', 
    component: AdminDashboardComponent,
    canActivate: [AuthService],
    data: { requiresAdmin: true }
  },
  {
    path: 'admin/news/create',
    component: AdminNewsFormComponent,
    canActivate: [AuthService],
    data: { requiresAdmin: true }
  },
  {
    path: 'admin/news/edit/:id',
    component: AdminNewsFormComponent,
    canActivate: [AuthService],
    data: { requiresAdmin: true }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
