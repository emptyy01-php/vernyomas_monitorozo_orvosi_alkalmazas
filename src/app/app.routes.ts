import { Routes } from '@angular/router';
import { authGuard, publicGuard } from './shared/guards/auth/auth.guard';

export const routes: Routes = [
    { 
        path: '', 
        loadComponent: () => import('./pages/home/home.component').then(c => c.HomeComponent)
      },
      { 
        path: 'pages/home', 
        loadComponent: () => import('./pages/home/home.component').then(c => c.HomeComponent),
      },
      { 
        path: 'pages/login', 
        loadComponent: () => import('./pages/login/login.component').then(c => c.LoginComponent),
        canActivate: [publicGuard]
      },  
      {
        path: 'pages/signup', 
        loadComponent: () => import('./pages/signup/signup.component').then(c => c.SignupComponent),
        canActivate: [publicGuard]
      },
      { 
        path: 'pages/measurement', 
        loadComponent: () => import('./pages/measurement/measurement.component').then(c => c.MeasurementComponent),
        canActivate: [authGuard]
      },
      { 
        path: 'pages/useful-information', 
        loadComponent: () => import('./pages/useful-information/useful-information.component').then(c => c.UsefulInformationComponent),
        
      },
      { 
        path: 'pages/doctors', 
        loadComponent: () => import('./pages/doctors/doctors.component').then(c => c.DoctorsComponent),
        canActivate: [authGuard]
      },
      { 
        path: 'pages/appointment-scheduling', 
        loadComponent: () => import('./pages/appointment-scheduling/appointment-scheduling.component').then(c => c.AppointmentSchedulingComponent),
        canActivate: [authGuard]
      },
      {
        path: 'pages/profil',
        loadComponent: () => import('./pages/profil/profil.component').then(c => c.ProfileComponent),
        canActivate: [authGuard]
      },
      {
        path: 'pages/doctor',
        loadComponent: () => import('./pages/doctor/doctor.component').then(c => c.DoctorComponent),
        canActivate: [authGuard]
      },
      { 
        path: '**', 
        loadComponent: () => import('./shared/page-not-found/page-not-found.component').then(c => c.PageNotFoundComponent),
        
      }

];
