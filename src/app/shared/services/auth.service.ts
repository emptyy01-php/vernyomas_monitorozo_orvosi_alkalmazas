import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  authState,
  User as FirebaseUser,
  UserCredential,
  createUserWithEmailAndPassword
} from '@angular/fire/auth';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  setDoc
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, switchMap, of } from 'rxjs';
import { User } from '../models/User'; // saját User interfész (id, firstname, stb.)

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: Observable<User | null>;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {
    // authState = Firebase-féle User, de lefordítjuk a saját User modellünkre
    this.currentUser = authState(this.auth).pipe(
      switchMap((firebaseUser: FirebaseUser | null) => {
        if (!firebaseUser) return of(null);
        return this.fetchUserData(firebaseUser.uid);
      })
    );
  }

  signIn(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  signOut(): Promise<void> {
    localStorage.setItem('isLoggedIn', 'false');
    return signOut(this.auth).then(() => {
      this.router.navigateByUrl('pages/home');
    });
  }

  async signUp(email: string, password: string, userData: Partial<User>): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);

      const fullUserData: User = {
        ...userData,
        id: userCredential.user.uid,
        email,
        medicationIds: [],
      } as User;

      await this.createUserData(userCredential.user.uid, fullUserData);

      return userCredential;
    } catch (error) {
      console.error('Hiba a regisztráció során:', error);
      throw error;
    }
  }

  private async createUserData(userId: string, userData: Partial<User>): Promise<void> {
    const userRef = doc(collection(this.firestore, 'Users'), userId);
    return setDoc(userRef, userData);
  }

  private async fetchUserData(userId: string): Promise<User | null> {
    try {
      const userDocRef = doc(this.firestore, 'Users', userId);
      const userSnapshot = await getDoc(userDocRef);

      if (!userSnapshot.exists()) return null;

      return {
        ...(userSnapshot.data() as User),
        id: userId
      };
    } catch (error) {
      console.error('Hiba a felhasználó adatainak lekérdezésekor:', error);
      return null;
    }
  }

  // hasznos lehet a komponensekben
  isLoggedIn(): Observable<User | null> {
    return this.currentUser;
  }

  updateLoginStatus(isLoggedIn: boolean): void {
    localStorage.setItem('isLoggedIn', isLoggedIn ? 'true' : 'false');
  }
}
