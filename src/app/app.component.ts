import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './shared/menu/menu.component';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MenuComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'uwu';
  isLoggedIn = false;
  colorType: "Light" | "Dark" = "Light";
  iconType: "light_mode" | "dark_mode" = "light_mode";

  constructor() {}

  ngOnInit(): void {
    this.checkLoginStatus();
  }

  checkLoginStatus(): void {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }

  logout(): void {
    localStorage.setItem('isLoggedIn', 'false');
    this.isLoggedIn = false;
    window.location.href = '/pages/home';
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