import { Component } from '@angular/core';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { AllDepartmentsComponent } from './all-departments/all-departments.component';
import { DepartmentsTableComponent } from './departments-table/departments-table.component';

@Component({
  selector: 'app-departments',
  imports: [NavbarComponent , AllDepartmentsComponent , DepartmentsTableComponent],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.scss'
})
export class DepartmentsComponent {

}
