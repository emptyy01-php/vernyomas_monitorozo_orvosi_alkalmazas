import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideFirebaseApp(() => initializeApp({ projectId: "vernyomas-monitor", appId: "1:673378762113:web:2849770cb189ddbfebbc80", storageBucket: "vernyomas-monitor.firebasestorage.app", apiKey: "AIzaSyCAvnU1-Hl2TmueIheCMX1p8imvt46QEAA", authDomain: "vernyomas-monitor.firebaseapp.com", messagingSenderId: "673378762113" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())]
};
