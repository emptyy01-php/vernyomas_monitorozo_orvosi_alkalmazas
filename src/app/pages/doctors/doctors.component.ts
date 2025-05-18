
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.scss']
})
export class DoctorsComponent {
  
  doctors = [
    {
      id: '1',
      name: 'Dr. Sallai Ákos',
      title: '🩺 Kardiológus, Elektrofiziológus',
      image: '/orvos/01.png',
      description: [
        'Dr. Sallai Ákos egy fiatal, ambiciózus kardiológus, aki mindig is elkötelezett volt a szív- és érrendszeri betegségek kezelésében. Már orvosi pályája kezdetén tudta, hogy a szív gyógyítása lesz az ő igazi küldetése. A szív, mint az élet motorja, lenyűgözte, és megfogadta, hogy minden tudását és energiáját a kardiológia területére összpontosítja.',
        'Ákos a Pécsi Orvostudományi Egyetemen szerezte meg diplomáját, majd hosszú évekig dolgozott tapasztalt kardiológusok mellett, hogy elsajátítsa a szívbetegségek legújabb kezelési módszereit. Fiatal kora ellenére kivételes tehetséggel rendelkezett a diagnózis felállításában, és hamarosan elismert szakemberré vált a helyi kórházban.',
        'A munkája során Ákos mindig különös figyelmet fordított arra, hogy a betegek ne csak a gyógyszerekre, hanem az életmódjukra és a megelőzésre is összpontosítsanak. Úgy vélte, hogy a szívbetegségek megelőzése kulcsfontosságú, és sokszor egy egyszerű életmódbeli változtatás is óriási különbséget jelenthet.'
      ]
    },
    /*
    {
      id: '2',
      name: 'Dr. Kovács Tímea',
      title: '🩺 Gyermekkardiológus, Hematológus',
      image: '/orvos/02.png',
      description: [
        'Dr. Kovács Tímea gyermekkardiológus és hematológus már gyermekkorában is a tudományok iránt érdeklődött, különösen az orvostudomány foglalkoztatta. A szív, mint az élet motorja, és a vérkeringés, mint az egész test működésének alapja, mindig lenyűgözte. Tímea a Pécsi Orvostudományi Egyetem hallgatójaként érezte meg először, hogy a gyermekek gyógyítása lesz az ő igazi hivatása.',
        'Miután elvégezte az orvosi egyetemet, és sikeresen megszerezte a kardiológia szakképesítést, Tímea úgy döntött, hogy tovább specializálódik a gyermekkardiológia területére. Az egyetemen szerzett tapasztalatai alapján arra jött rá, hogy a szívbetegségek gyermekeknél másként jelentkeznek, mint a felnőttek esetében, és sokszor komoly kihívásokat jelentenek a diagnózis felállítása és a megfelelő kezelési módszerek kiválasztása.',
        'Tímea számára a legfontosabb a megelőzés és a korai felismerés volt. Egyre inkább elköteleződött amellett, hogy a gyerekek szívbetegségeit már az első életévekben észrevegyék, hogy a jövőben elkerülhetők legyenek a súlyosabb szövődmények. Az évek során számos sikeres kezelést végzett, de egy különleges eset mély nyomot hagyott benne.'
      ]
    }
      */
  ];
  
  constructor(private router: Router) { }  

  navigateToAppointmentScheduling(doctor: { id: string, name: string }) {
    this.router.navigate(['/pages/appointment-scheduling'], { queryParams: { doctorId: doctor.id, doctorName: doctor.name } });
  }
}