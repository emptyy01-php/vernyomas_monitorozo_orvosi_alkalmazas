import { Injectable } from '@angular/core';
import { collection, collectionData, doc, addDoc, query, where } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';
import { Measurement } from '../models/measurement';
import { AuthService } from './auth.service'; // szükséges userId-hez
import { Timestamp } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MeasurementService {
  constructor(private firestore: Firestore, private authService: AuthService) {}

  async addMeasurement(measurement: Omit<Measurement, 'id' | 'userId'>): Promise<void> {
  const user = await firstValueFrom(this.authService.currentUser);
  if (!user) throw new Error('Nincs bejelentkezett felhasználó');

  const docRef = collection(this.firestore, 'measurements');
  await addDoc(docRef, {
    ...measurement,
    userId: user.id,
    timestamp: Date.now()
  });
}

  getUserMeasurements(userId: string): Observable<Measurement[]> {
    const ref = collection(this.firestore, 'measurements');
    const q = query(ref, where('userId', '==', userId));
    return collectionData(q, { idField: 'id' }) as Observable<Measurement[]>;
  }
}
