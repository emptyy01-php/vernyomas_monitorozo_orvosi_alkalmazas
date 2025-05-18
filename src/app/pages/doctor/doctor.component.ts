import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Firestore, collection, query, where, getDocs, addDoc, deleteDoc, doc, updateDoc, orderBy } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { User } from '../../shared/models/User';
import { Medicine } from '../../shared/models/Medicines';
import { UserMedicine } from '../../shared/models/user-medicine';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';

import { AppointmentModel } from '../../shared/models/appointment';
import { AppointmentService } from '../../shared/services/appointment.service';
import { AuthService } from '../../shared/services/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-doctor',
  standalone: true,
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule
  ]
})
export class DoctorComponent implements OnInit, AfterViewInit {

  appointments: AppointmentModel[] = [];
  isLoading = true;

  medicineForm: FormGroup;
  editMedicineForm: FormGroup;
  searchForm: FormGroup;
  assignForm: FormGroup;

  user: User | null = null;
  medicines: Medicine[] = [];
  userMedicines: { um: UserMedicine; medicine: Medicine }[] = [];

  measurements: any[] = [];

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns = ['systolic', 'diastolic', 'pulse', 'timestamp'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  editingMedicine: Medicine | null = null;

  constructor(
    private fb: FormBuilder,
    private firestore: Firestore,
    private appointmentService: AppointmentService,
    private authService: AuthService
  ) {
    this.medicineForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });

    this.editMedicineForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });

    this.searchForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.assignForm = this.fb.group({
      medicineId: ['', Validators.required],
      medicationStartDate: ['', Validators.required],
      medicationEndDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAllMedicines();
    this.loadAppointmentsForDoctor();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // --- Gyógyszerek kezelése ---

  async loadAllMedicines() {
    const snapshot = await getDocs(collection(this.firestore, 'Medicines'));
    this.medicines = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Medicine));
  }

  async addMedicine() {
    if (this.medicineForm.invalid) return;

    await addDoc(collection(this.firestore, 'Medicines'), this.medicineForm.value);
    alert('Gyógyszer hozzáadva!');
    this.medicineForm.reset();
    await this.loadAllMedicines();
  }

  startEdit(med: Medicine) {
    this.editingMedicine = med;
    this.editMedicineForm.patchValue({
      name: med.name,
      description: med.description
    });
  }

  cancelEdit() {
    this.editingMedicine = null;
    this.editMedicineForm.reset();
  }

  async updateMedicine() {
    if (!this.editingMedicine || this.editMedicineForm.invalid) return;

    const updatedData = this.editMedicineForm.value;
    const medRef = doc(this.firestore, 'Medicines', this.editingMedicine.id);
    await updateDoc(medRef, updatedData);

    alert('Gyógyszer frissítve!');
    this.editingMedicine = null;
    this.editMedicineForm.reset();
    await this.loadAllMedicines();
  }

  async deleteMedicine(medicineId: string) {
    const confirmDelete = confirm('Biztosan törölni szeretnéd ezt a gyógyszert?');
    if (!confirmDelete) return;

    await deleteDoc(doc(this.firestore, 'Medicines', medicineId));
    alert('Gyógyszer törölve!');
    await this.loadAllMedicines();
  }

  // --- Időpontok kezelése ---

  async loadAppointmentsForDoctor() {
    const user = await firstValueFrom(this.authService.currentUser);
    if (!user) {
      this.appointments = [];
      this.isLoading = false;
      return;
    }

    const firstName = user.firstname.trim().toLowerCase();
    const lastName = user.lastname.trim().toLowerCase();

    const q = query(
      collection(this.firestore, 'appointments'),
      orderBy('date', 'desc')
    );

    const snapshot = await getDocs(q);
    const allAppointments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AppointmentModel));

    this.appointments = allAppointments.filter(app => {
      if (!app.doctorName) return false;

      // Feltételezve, hogy "Vezetéknév Keresztnév" formátum
      const parts = app.doctorName.trim().split(' ');
      if (parts.length < 2) return false;

      const [docLastName, docFirstName] = parts;

      return docFirstName.toLowerCase() === firstName && docLastName.toLowerCase() === lastName;
    });

    this.isLoading = false;
  }

  async updateAppointmentStatus(appointmentId: string, newStatus: 'accepted' | 'rejected') {
    const appointmentRef = doc(this.firestore, 'appointments', appointmentId);
    await updateDoc(appointmentRef, { status: newStatus });

    const index = this.appointments.findIndex(a => a.id === appointmentId);
    if (index !== -1) {
      this.appointments[index].status = newStatus;
      this.appointments = [...this.appointments]; // új trigger a változásra
    }
  }

  getHungarianStatus(status: string): string {
    switch (status) {
      case 'pending': return 'Eldöntendő';
      case 'accepted': return 'Elfogadva';
      case 'rejected': return 'Elutasítva';
      default: return 'Ismeretlen';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'accepted': return 'status-accepted';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // --- Felhasználó keresése és adatainak betöltése ---

  async searchUser() {
    const email = this.searchForm.value.email;
    const userQuery = query(collection(this.firestore, 'Users'), where('email', '==', email));
    const snapshot = await getDocs(userQuery);

    if (!snapshot.empty) {
      const docSnap = snapshot.docs[0];
      this.user = { ...docSnap.data(), id: docSnap.id } as User;

      await this.loadUserMedicines();
      await this.loadUserMeasurements(this.user.id);
    } else {
      alert('Nincs ilyen felhasználó.');
      this.user = null;
      this.userMedicines = [];
      this.measurements = [];
      this.dataSource.data = [];
    }
  }

  // --- Felhasználóhoz rendelt gyógyszerek kezelése ---

  async loadUserMedicines() {
    if (!this.user) return;

    const q = query(collection(this.firestore, 'UserMedicines'), where('userId', '==', this.user.id));
    const snapshot = await getDocs(q);
    const umDocs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as UserMedicine));

    this.userMedicines = umDocs.map(um => {
      const med = this.medicines.find(m => m.id === um.medicineId);
      return { um, medicine: med! };
    });
  }

  async assignMedicine() {
    if (!this.user || this.assignForm.invalid) return;

    const { medicineId, medicationStartDate, medicationEndDate } = this.assignForm.value;

    await addDoc(collection(this.firestore, 'UserMedicines'), {
      userId: this.user.id,
      medicineId,
      medicationStartDate: new Date(medicationStartDate),
      medicationEndDate: new Date(medicationEndDate),
    });

    this.assignForm.reset();
    await this.loadUserMedicines();
  }

  async removeMedicine(umId: string) {
    await deleteDoc(doc(this.firestore, 'UserMedicines', umId));
    await this.loadUserMedicines();
  }

  // --- Felhasználó vérnyomásméréseinek betöltése ---

  async loadUserMeasurements(userId: string) {
    const q = query(
      collection(this.firestore, 'measurements'),
      where('userId', '==', userId),
      orderBy('timestamp', 'asc')
    );
    const snapshot = await getDocs(q);
    this.measurements = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

    this.dataSource.data = this.measurements;

    // Paginátor és rendezés hozzárendelése (biztos ami biztos)
    if (this.paginator) this.dataSource.paginator = this.paginator;
    if (this.sort) this.dataSource.sort = this.sort;
  }
}
