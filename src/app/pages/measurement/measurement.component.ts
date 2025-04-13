import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MeasurementFormComponent } from "../../components/measurement-form/measurement-form.component";
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort, MatSortModule} from '@angular/material/sort';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}



@Component({
  selector: 'app-measurement',
  imports: [
    MeasurementFormComponent,
    MatTableModule,
    MatSortModule
  ],
  templateUrl: './measurement.component.html',
  styleUrl: './measurement.component.scss'
})


export class MeasurementComponent implements AfterViewInit {
  displayedColumns: string[] = ['position', 'name', 'symbol'];
  dataSource = new MatTableDataSource<any>([]); 
  private nextPosition = 1;

  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  addMeasurement(measurement: any) {
    const newRow = {
      position: this.nextPosition++,
      name: `SYS: ${measurement.systolic} / DIA: ${measurement.diastolic} /PUL ${measurement.pulse}`,
      
      symbol: new Date(measurement.timestamp).toLocaleString()
    };

    this.dataSource.data = [...this.dataSource.data, newRow];
  }
}


