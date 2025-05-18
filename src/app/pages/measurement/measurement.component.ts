
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MeasurementFormComponent } from '../../components/measurement-form/measurement-form.component';
import { MeasurementService } from '../../shared/services/measurement.service';
import { Measurement } from '../../shared/models/measurement';
import { AuthService } from '../../shared/services/auth.service'; 
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-measurement',
  standalone: true,
  templateUrl: './measurement.component.html',
  styleUrl: './measurement.component.scss',
  imports: [CommonModule, MeasurementFormComponent, MatTableModule, MatSortModule]
})
export class MeasurementComponent implements AfterViewInit {
  displayedColumns: string[] = ['position', 'values', 'date'];
  dataSource = new MatTableDataSource<any>([]);
  private nextPosition = 1;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private measurementService: MeasurementService, private authService: AuthService) {}

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.loadMeasurements();
  }

  async addMeasurement(measurement: any) {
    const user = await firstValueFrom(this.authService.currentUser);
    if (!user) return;

    const newMeasurement: Measurement = {
      ...measurement,
      userId: user.id
    };

    await this.measurementService.addMeasurement(newMeasurement);
    this.loadMeasurements();
  }

  async loadMeasurements() {
    const user = await firstValueFrom(this.authService.currentUser);
    if (!user) return;

    this.measurementService.getUserMeasurements(user.id).subscribe(measurements => {
      this.dataSource.data = measurements.map((m, index) => ({
        position: index + 1,
        values: `SYS: ${m.systolic} / DIA: ${m.diastolic} / PUL: ${m.pulse}`,
        date: new Date(m.timestamp).toLocaleString()
      }));
    });
  }

}
