import { Component, inject} from '@angular/core';
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


export class AppointmentSchedulingComponent {
  private _formBuilder = inject(FormBuilder);

  selectedMapUrl: string = '';

  firstFormGroup = this._formBuilder.group({
    name: ['', Validators.required],
    address: ['', Validators.required],
    taj: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?\d{1,4}[-\s]?\(?\d+\)?[-\s]?\d+$/)]],
    note: ['']
  });

  secondFormGroup = this._formBuilder.group({
    date: ['', Validators.required],
    time: ['', Validators.required],
    location: ['', Validators.required]
  });
  constructor() {
    this.secondFormGroup.get('location')?.valueChanges.subscribe(location => {
      if (location) {
        this.updateMap(location);
      }
    });
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

  minDate = new Date();
  isLinear = false;

}
