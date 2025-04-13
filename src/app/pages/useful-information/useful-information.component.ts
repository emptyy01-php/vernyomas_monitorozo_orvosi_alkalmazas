import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-useful-information',
  imports: [
    MatCardModule,
    CommonModule

  ],
  templateUrl: './useful-information.component.html',
  styleUrl: './useful-information.component.scss'
})
export class UsefulInformationComponent {

  cards = [
    { title: 'Mit jelent a vérnyomás?', text: 'A vérnyomás a szív által pumpált vérerek falára gyakorolt nyomását jelenti. Két értékből áll: a szisztolés (felső) érték a szív összehúzódásakor mért nyomás, míg a diasztolés (alsó) érték a szív elernyedésekor mért nyomás.' },
    { title: 'Milyen a normális vérnyomás?', text: 'Az optimális vérnyomás 120/80 Hgmm alatt van. A 140/90 Hgmm feletti értékeket magas vérnyomásnak (hipertóniának) tekintjük.' },
    { title: 'Miért veszélyes a magas vérnyomás?', text: 'A kezeletlen magas vérnyomás növeli a szívroham, stroke, vesebetegség és más súlyos egészségügyi problémák kockázatát.' },
    { title: 'Milyen tényezők növelik a vérnyomást?', text: 'A túlsúly, mozgáshiány, túlzott só- és alkoholfogyasztás, stressz, valamint bizonyos gyógyszerek mind hozzájárulhatnak a magas vérnyomás kialakulásához.' },
    { title: '„A magas vérnyomás mindig tüneteket okoz.” – Tévhit!', text: 'A magas vérnyomás gyakran tünetmentes, ezért is nevezik „csendes gyilkosnak”. Rendszeres mérés nélkül sokan nem is tudnak róla, hogy érintettek.' },
    { title: '„A magas vérnyomás csak időseket érint.” – Tévhit!', text: 'Bár az idősebb korosztályban gyakoribb, a magas vérnyomás fiatalabbakat is érinthet, különösen, ha egészségtelen életmódot folytatnak.' },
    { title: 'A keresztbetett lábbal ülés emelheti a vérnyomást.', text: 'Ez a testhelyzet növelheti a vérnyomást, különösen magas vérnyomás esetén érdemes kerülni.' },
    { title: 'A meleg időjárás csökkentheti a vérnyomást.', text: 'Melegben az erek kitágulnak, ami alacsonyabb vérnyomást eredményezhet. Ilyenkor óvatosan kell bánni a vérnyomáscsökkentő gyógyszerekkel.' },
    { title: 'Egészséges életmód', text: 'A rendszeres testmozgás, kiegyensúlyozott étrend, dohányzás mellőzése és a stressz csökkentése mind hozzájárulhatnak a vérnyomás normalizálásához.' },
    { title: 'Rendszeres ellenőrzés', text: 'Mivel a magas vérnyomás gyakran tünetmentes, fontos a rendszeres vérnyomásmérés, hogy időben felismerjük és kezeljük a problémát.' },
  ];
  expanded = [false, false, false, false, false, false, false, false, false, false];
  
  toggle(index: number) {
    this.expanded[index] = !this.expanded[index];
  }
}
