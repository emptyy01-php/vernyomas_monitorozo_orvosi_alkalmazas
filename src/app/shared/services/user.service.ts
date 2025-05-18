import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, collection, query, where, getDocs, docData } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Observable, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../models/User';
import { Medicine } from '../models/Medicines';
import { UserMedicine } from '../models/user-medicine';
import { UserProfile } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) { }

 getUserProfile(userId: string): Observable<User> {
  const userDoc = doc(this.firestore, `users/${userId}`);
  return docData(userDoc) as Observable<User>;
}

  /** Ez adja vissza a usert + userMedicines + medicines tömböket egyben */
  getUserProfileFull(): Observable<{
    user: User | null;
    userMedicines: UserMedicine[];
    medicines: Medicine[];
  }> {
    return this.authService.currentUser.pipe(
      switchMap(authUser => {
        if (!authUser) {
          return of({
            user: null,
            userMedicines: [],
            medicines: [],
          });
        }
        return from(this.fetchUserMedicinesAndMedicines(authUser.id));
      })
    );
  }

  private async fetchUserMedicinesAndMedicines(userId: string): Promise<{
    user: User | null;
    userMedicines: UserMedicine[];
    medicines: Medicine[];
  }> {
    try {
      // 1. Felhasználó lekérése
      const userDocRef = doc(this.firestore, 'Users', userId);
      const userSnapshot = await getDoc(userDocRef);

      if (!userSnapshot.exists()) {
        return {
          user: null,
          userMedicines: [],
          medicines: []
        };
      }

      const user = { ...userSnapshot.data(), id: userSnapshot.id } as User;

      // 2. UserMedicine doksik lekérése
      const userMedicinesQuery = query(
        collection(this.firestore, 'UserMedicines'),
        where('userId', '==', userId)
      );
      const userMedicinesSnapshot = await getDocs(userMedicinesQuery);

      const userMedicines: UserMedicine[] = [];
      userMedicinesSnapshot.forEach(doc => {
        userMedicines.push({ ...doc.data(), id: doc.id } as UserMedicine);
      });

      if (userMedicines.length === 0) {
        return {
          user,
          userMedicines: [],
          medicines: []
        };
      }

      // 3. Medicine-k lekérése a UserMedicine-ek alapján
      const medicineIds = userMedicines.map(um => um.medicineId);

      // Firestore in query limit: max 10 ID, ezért érdemes batch-ben kezelni, de most egyszerűen így:
      const medsQuery = query(
        collection(this.firestore, 'Medicines'),
        where('__name__', 'in', medicineIds)
      );
      const medsSnapshot = await getDocs(medsQuery);

      const medicines: Medicine[] = [];
      medsSnapshot.forEach(doc => {
        medicines.push({ ...doc.data(), id: doc.id } as Medicine);
      });

      return {
        user,
        userMedicines,
        medicines
      };

    } catch (error) {
      console.error('Hiba a user + userMedicines + medicines lekérése során:', error);
      return {
        user: null,
        userMedicines: [],
        medicines: []
      };
    }
  }
}
