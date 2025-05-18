import { Injectable } from '@angular/core';
import { Firestore, deleteDoc, collection, addDoc } from '@angular/fire/firestore';
import { AppointmentModel } from '../../shared/models/appointment';
import { collectionData, docData, doc, CollectionReference } from '@angular/fire/firestore';
import { query, where, getDocs } from '@angular/fire/firestore';
import { from, map, Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
@Injectable({ providedIn: 'root' })
export class AppointmentService {
  constructor(private firestore: Firestore) {}

  // Időpont hozzáadása (már megvan nálad)
  addAppointment(appointment: AppointmentModel): Promise<void> {
    const appointmentsRef = collection(this.firestore, 'appointments');
    return addDoc(appointmentsRef, appointment).then(() => {});
  }

  deleteAppointment(appointmentId: string): Promise<void> {
    const appointmentDocRef = doc(this.firestore, 'appointments', appointmentId);
    return deleteDoc(appointmentDocRef);
  }

  // Ez a metódus lekéri az adott user összes időpontját
  getUserAppointments(userId: string): Observable<AppointmentModel[]> {
    const appointmentsRef = collection(this.firestore, 'appointments');
    const q = query(appointmentsRef, where('userId', '==', userId));
    return from(
      getDocs(q).then(snapshot =>
        snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AppointmentModel))
      )
    );
  }

  getAppointmentsByDoctor(doctorId: string): Observable<AppointmentModel[]> {
  const appointmentsRef = collection(this.firestore, 'appointments');
  const q = query(appointmentsRef, where('doctorId', '==', doctorId));
  return from(getDocs(q)).pipe(
    map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AppointmentModel)))
  );
}
}