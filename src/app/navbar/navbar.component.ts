import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  isAdmin = false;
  fullName = '';
  showMobileMenu = false;
  private userSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Initialize subscription in constructor
    this.userSubscription = this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.isLoggedIn = true;
        this.isAdmin = user.role === 'admin';
        this.fullName = user.full_name || user.username || user.email;
      } else {
        this.isLoggedIn = false;
        this.isAdmin = false;
        this.fullName = '';
      }
    });
  }

  ngOnInit() {
    // No need to subscribe here since we're doing it in constructor
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }
} 