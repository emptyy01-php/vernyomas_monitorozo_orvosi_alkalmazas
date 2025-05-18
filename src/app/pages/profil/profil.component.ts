import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Subscription } from 'rxjs';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/User';
import { Medicine } from '../../shared/models/Medicines';
import { UserMedicine } from '../../shared/models/user-medicine';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ViewChild, AfterViewInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { MeasurementService } from '../../shared/services/measurement.service';
import { firstValueFrom } from 'rxjs';
import { AppointmentService } from '../../shared/services/appointment.service';
import { Auth } from '@angular/fire/auth';
import {
  MatTableModule,
  MatHeaderCellDef,
  MatCellDef,
  MatHeaderRowDef,
  MatRowDef,
} from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { AppointmentModel } from '../../shared/models/appointment';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule
  ],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.scss'
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: User | null = null;
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['systolic', 'diastolic', 'pulse', 'timestamp'];

  appointments: AppointmentModel[] = [];
  

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  /** a felhasználóhoz tartozó UserMedicine doksik */
  userMedicines: UserMedicine[] = [];

  /** gyors lookup: medicineId → Medicine */
  medicinesMap: Record<string, Medicine> = {};

  isLoading = true;
  private sub?: Subscription;

  
constructor(
  private userService: UserService,
  private authService: AuthService,
  private measurementService: MeasurementService,
  private appointmentService: AppointmentService,
  private auth: Auth
) {}
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property === 'timestamp') return item.timestamp;
      return item[property];
    };
    this.loadMeasurements();
  }
  async loadMeasurements() {
    const user = await firstValueFrom(this.authService.currentUser);
    if (!user) return;

    this.measurementService.getUserMeasurements(user.id).subscribe(measurements => {
      const sorted = measurements.sort((a, b) => b.timestamp - a.timestamp); // legfrissebb elöl
      this.dataSource.data = sorted;
    });
  }
    formatDate(isoString: string): string {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    const days = ['Vasárnap', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat'];
    const months = ['január', 'február', 'március', 'április', 'május', 'június', 'július', 'augusztus', 'szeptember', 'október', 'november', 'december'];

    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const day = date.getDate();
    const dayName = days[date.getDay()];

    return `${year}. ${month} ${day}. (${dayName})`;
  }
  
  getStatusText(status: string): string {
    switch (status) {
      case 'accepted': return 'Elfogadva';
      case 'rejected': return 'Elutasítva';
      case 'pending': default: return 'Eldöntendő';
    }
  }
  
  getStatusClass(status: string): string {
    switch (status) {
      case 'accepted': return 'status-accepted';
      case 'rejected': return 'status-rejected';
      case 'pending': default: return 'status-pending';
    }
  }  
  confirmDelete(appointmentId: string): void {
    const confirmed = window.confirm('Biztosan törölni szeretnéd a foglalást?');
    if (confirmed) {
      this.deleteAppointment(appointmentId);
    }
  }


  deleteAppointment(appointmentId: string) {
    this.appointmentService.deleteAppointment(appointmentId)
      .then(() => {
        // Ha sikeres a törlés, frissítjük az appointments tömböt, hogy eltűnjön a UI-ról az adott elem
        this.appointments = this.appointments.filter(app => app.id !== appointmentId);
      })
      .catch(err => {
        console.error('Hiba a foglalás törlésekor:', err);
        alert('Sajnáljuk, a törlés sikertelen volt.');
      });
  }

  ngOnInit(): void {
      this.sub = this.userService.getUserProfileFull().subscribe({
      next: (data) => {
        this.user = data.user;
        this.userMedicines = data.userMedicines.map(um => ({
  ...um,
  medicationStartDate: um.medicationStartDate instanceof Date
    ? um.medicationStartDate
    : (um.medicationStartDate as any).toDate(),
  medicationEndDate: um.medicationEndDate instanceof Date
    ? um.medicationEndDate
    : (um.medicationEndDate as any).toDate()
}));
        this.medicinesMap = data.medicines.reduce((acc, m) => ({ ...acc, [m.id]: m }), {});
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });

     // Időpontok betöltése
    const userId = this.auth.currentUser?.uid;
    if (userId) {
      this.appointmentService.getUserAppointments(userId).subscribe(apps => {
        this.appointments = apps;
    });
  }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  /** segédfüggvény a sablonhoz */
  medName(id: string): string {
    return this.medicinesMap[id]?.name ?? id;
  }
  medDesc(id: string): string | undefined {
    return this.medicinesMap[id]?.description;
  }

  getUserInitials(): string {
    if (!this.user) return '?';
    return (
      (this.user.firstname[0] ?? '').toUpperCase() +
      (this.user.lastname[0] ?? '').toUpperCase()
    );
  }
}
