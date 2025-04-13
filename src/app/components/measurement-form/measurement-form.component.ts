import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importáljuk a FormsModule-t
import {MatSlideToggleModule} from '@angular/material/slide-toggle'; // Dark mode cucc



@Component({
  selector: 'app-measurement-form',
  standalone: true,
  imports: [FormsModule, CommonModule, MatSlideToggleModule],
  templateUrl: './measurement-form.component.html',
  styleUrls: ['./measurement-form.component.scss']
})
export class MeasurementFormComponent {
  @Output() measurementSaved = new EventEmitter<any>();

  measurement = {
    systolic: null,
    diastolic: null,
    pulse: null,
    timestamp: ''
  };

  onSubmit() {
    this.measurementSaved.emit({ ...this.measurement });

    // Itt igazából csak nullázzuk az űrlapot submit után
    this.measurement = {
      systolic: null,
      diastolic: null,
      pulse: null,
      timestamp: ''
    };
  }


}
