import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list'
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { signOut } from '@angular/fire/auth';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatIconModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  @Input() sidenav!: MatSidenav;
  @Input() isLoggedIn = false;
  @Input() userRole: string | null = null;
  @Output() logoutEvent = new EventEmitter<void>();

  closeMenu() {
    if (this.sidenav) {
      this.sidenav.close();
    }
  }

  logoutClicked(event: MouseEvent) {
    event.preventDefault();
    this.logoutEvent.emit();
    this.closeMenu();
  }
}