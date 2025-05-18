import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  // A FormControl olyan osztály, ami egyetlen űrlapmezőt kezel.
  email = new FormControl('');
  password = new FormControl('');
  isLoading: boolean = false;
  loginError: string = '';
  showLoginForm: boolean = true;
  authSubscription?: Subscription;


  constructor(
    private authService: AuthService, 
    private router: Router
  ) { }

  login() {
    if (this.email.invalid) {
      this.loginError = 'Használjon létező emailt!';
      return;
    }
    
    if (this.password.invalid) {
      this.loginError = 'A jelszónak legalább 6 karakternek kell lennie.';
      return;
    }

    const emailValue = this.email.value || '';
    const passwordValue = this.password.value || '';
    
    this.isLoading = true;
    this.showLoginForm = false;
    this.loginError = '';

    this.authService.signIn(emailValue, passwordValue)
      .then(userCredential => {
        console.log('Login successful:', userCredential.user);
        this.authService.updateLoginStatus(true);
        this.router.navigateByUrl('pages/home');
      })
      .catch(error => {
        console.error('Login error:', error);
        this.isLoading = false;
        this.showLoginForm = true;
        
        switch(error.code) {
          case 'auth/user-not-found':
            this.loginError = 'Nem létezik ilyen fióka  rendszerben.';
            break;
          case 'auth/wrong-password':
            this.loginError = 'Érvénytelen belépési adatok!';
            break;
          case 'auth/invalid-credential':
            this.loginError = 'Érvénytelen belépési adatok!';
            break;
          default:
            this.loginError = 'Azonosítás nem sikerült. Próbálja meg később!';
        }
      });
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
  }

}