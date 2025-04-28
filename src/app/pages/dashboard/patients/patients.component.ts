import { Component } from '@angular/core';
import { NavbarComponent } from "../../../components/navbar/navbar.component";
import { PatientsTableComponent } from "./patients-table/patients-table.component";

@Component({
  selector: 'app-patients',
  imports: [NavbarComponent, PatientsTableComponent],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.scss'
})
export class PatientsComponent {

}
