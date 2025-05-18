import { Component, OnDestroy, inject, OnInit} from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { SafeUrlPipe } from './safe-url.pipe';
import { NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Firestore, collection, addDoc, serverTimestamp } from '@angular/fire/firestore';
import { AppointmentModel } from '../../shared/models/appointment';
import { AppointmentService } from '../../shared/services/appointment.service';
import { Auth } from '@angular/fire/auth';
import { UserService} from '../../shared/services/user.service';
import { Subscription } from 'rxjs';
import { User } from '../../shared/models/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointment-scheduling',
  imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    SafeUrlPipe,
    NgIf
  ],
  templateUrl: './appointment-scheduling.component.html',
  styleUrl: './appointment-scheduling.component.scss'
})


export class AppointmentSchedulingComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private appointmentService = inject(AppointmentService);
  private userService = inject(UserService);
  private auth = inject(Auth);

  selectedMapUrl: string = '';
  selectedDoctorName: string = '';
  selectedDoctorId: string = '';

  minDate = new Date();
  isLinear = false;

  userProfileSubscription?: Subscription;

  firstFormGroup = this.fb.group({
    doctorName: [{ value: '', disabled: true }],
    name: ['', Validators.required],
    address: ['', Validators.required],
    taj: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?\d{1,4}[-\s]?\(?\d+\)?[-\s]?\d+$/)]],
    note: ['']
  });

  secondFormGroup = this.fb.group({
    date: ['', Validators.required],
    time: ['', Validators.required],
    location: ['', Validators.required]
  });

  constructor(private router: Router) {
  
    // Automatikus térkép frissítés
    this.secondFormGroup.get('location')?.valueChanges.subscribe(location => {
      if (location) {
        this.updateMap(location);
      }
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const doctorNameParam = params['doctorName'] || '';
      const doctorIdParam = params['doctorId'] || '';
      this.selectedDoctorName = doctorNameParam.replace(/^Dr\.\s*/i, '');
      this.selectedDoctorId = doctorIdParam;

      this.firstFormGroup.get('doctorName')?.setValue(this.selectedDoctorName);
    });

    // Auth user lekérése és profil adat betöltése
    this.auth.onAuthStateChanged(user => {
      if (user) {
        this.userProfileSubscription = this.userService.getUserProfile(user.uid).subscribe((profile: User) => {
          if (profile) {
            const fullName = `${profile.firstname} ${profile.lastname}`.trim();
            this.firstFormGroup.patchValue({
              name: fullName,
              email: profile.email
            });
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.userProfileSubscription?.unsubscribe();
  }

  updateMap(location: string): void {
    const addressMap: { [key: string]: string } = {
      budapest: 'Budapest+Alkotás+utca+1',
      debrecen: 'Debrecen+Piac+utca+2',
      szeged: 'Szeged+Tisza+Lajos+körút+3'
    };

    const address = addressMap[location] || '';
    this.selectedMapUrl = `https://maps.google.com/maps?q=${address}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
  }

  async submitAppointment(): Promise<void> {
    if (this.firstFormGroup.invalid || this.secondFormGroup.invalid || !this.selectedDoctorId) {
      return;
    }

    const dateValue = new Date(this.secondFormGroup.value.date!);

    const appointment: AppointmentModel = {
      userId: this.auth.currentUser?.uid ?? '',
      doctorId: this.selectedDoctorId,
      doctorName: this.selectedDoctorName,
      name: this.firstFormGroup.value.name!,
      address: this.firstFormGroup.value.address!,
      taj: this.firstFormGroup.value.taj!,
      email: this.firstFormGroup.value.email!,
      phone: this.firstFormGroup.value.phone!,
      note: this.firstFormGroup.value.note || '',
      date: dateValue.toISOString(),
      time: this.secondFormGroup.value.time!,
      location: this.secondFormGroup.value.location!,
      status: 'pending',
      createdAt: Date.now()
    };

    try {
      await this.appointmentService.addAppointment(appointment);
      console.log('Foglalás mentve!');
      this.router.navigate(['pages/home']);
      // Itt pl. léptess tovább vagy mutass visszajelzést
    } catch (error) {
      console.error('Hiba a foglalás mentésekor:', error);
    }
  }
}