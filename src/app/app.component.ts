import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './shared/menu/menu.component';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AuthService } from './shared/services/auth.service';
import { Subscription } from 'rxjs';
import { User } from './shared/models/User';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MenuComponent,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'vernyomas-monitor';
  isLoggedIn = false;
  currentUser: User | null = null;
  colorType: "Light" | "Dark" = "Light";
  iconType: "light_mode" | "dark_mode" = "light_mode";
  userRole: string | null = null;
  private authSubscription?: Subscription;

  constructor(private authService: AuthService) {}

 ngOnInit(): void {
    this.authSubscription = this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
      this.currentUser = user;
      this.userRole = user?.role ?? null;
      localStorage.setItem('isLoggedIn', this.isLoggedIn ? 'true' : 'false');
    });
  }

  checkLoginStatus(): void {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }

   logout(): void {
    this.authService.signOut(); // a logout kezelése már az AuthService-ben van
  }

  onToggleSidenav(sidenav: MatSidenav){
    sidenav.toggle();
  }

  changeTheme() {
    this.colorType = this.colorType === 'Light' ? 'Dark' : 'Light';
    this.iconType = this.iconType === 'light_mode' ? 'dark_mode' : 'light_mode';

    const body = document.body;

    if (this.colorType === 'Dark') {
      body.classList.add('dark-mode');
      body.classList.remove('light-mode');
  
    } else {
      body.classList.add('light-mode');
      body.classList.remove('dark-mode');
    }
  }
  
}