import { Component , OnInit } from '@angular/core';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { AllDoctorsComponent } from './all-doctors/all-doctors.component';
import { DoctorsTableComponent } from './doctors-table/doctors-table.component';



@Component({
  selector: 'app-doctors',
  imports: [NavbarComponent , AllDoctorsComponent , DoctorsTableComponent],
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.scss'
})

export class DoctorsComponent{

}
