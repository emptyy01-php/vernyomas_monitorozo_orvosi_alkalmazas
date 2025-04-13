import { Routes } from '@angular/router';


export const routes: Routes = [
    { 
        path: '', 
        loadComponent: () => import('./pages/home/home.component').then(c => c.HomeComponent)
      },
      { 
        path: 'pages/home', 
        loadComponent: () => import('./pages/home/home.component').then(c => c.HomeComponent)
      },
      { 
        path: 'pages/login', 
        loadComponent: () => import('./pages/login/login.component').then(c => c.LoginComponent)
      },
      {
        path: 'pages/signup', 
        loadComponent: () => import('./pages/signup/signup.component').then(c => c.SignupComponent)
      },
      { 
        path: 'pages/measurement', 
        loadComponent: () => import('./pages/measurement/measurement.component').then(c => c.MeasurementComponent)
      },
      { 
        path: 'pages/useful-information', 
        loadComponent: () => import('./pages/useful-information/useful-information.component').then(c => c.UsefulInformationComponent)
      },
      { 
        path: 'pages/doctors', 
        loadComponent: () => import('./pages/doctors/doctors.component').then(c => c.DoctorsComponent)
      },
      { 
        path: 'pages/appointment-scheduling', 
        loadComponent: () => import('./pages/appointment-scheduling/appointment-scheduling.component').then(c => c.AppointmentSchedulingComponent)
      },
      { 
        path: '**', 
        loadComponent: () => import('./shared/page-not-found/page-not-found.component').then(c => c.PageNotFoundComponent)
      }

];
