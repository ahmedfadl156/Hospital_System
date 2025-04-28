import { Component , OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { UserService } from '../../../../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Department {
    id: number;
    dep_name: string;
    staff_num: number;
    beds_num: number;
    equipments: number;
}

declare const bootstrap: any;

@Component({
  selector: 'app-all-departments',
  imports: [CommonModule , FormsModule],
  templateUrl: './all-departments.component.html',
  styleUrl: './all-departments.component.scss'
})
export class AllDepartmentsComponent implements OnInit{
  doctors: any[] = [];
  doctor: any = {};
  isEditMode: boolean = false;
  departments: Department[] = [];
  selectedDepartments: Department[] = [];
  departmentDialog: boolean = false;
  department: Department = {
      id: 0,
      dep_name: '',
      staff_num: 0,
      beds_num: 0,
      equipments: 0
  };
  submitted: boolean = false;

  constructor(private http: HttpClient, private messageService: MessageService) {}

  ngOnInit() {
      this.fetchDepartments();
  }

  fetchDepartments() {
      this.http.get<any>('http://localhost/Test php/departments.php')
          .subscribe({
              next: (response) => {
                  if (response.status === 'success') {
                      this.departments = response.departments;
                  } else {
                      this.messageService.add({
                          severity: 'error',
                          summary: 'Error',
                          detail: 'Failed to fetch departments'
                      });
                  }
              },
              error: (error) => {
                  this.messageService.add({
                      severity: 'error',
                      summary: 'Error',
                      detail: 'Failed to fetch departments: ' + error.message
                  });
              }
          });
  }
  openModal() {
    const modal = document.getElementById('addDoctorModal');
    if (modal) {
      const modalInstance = new bootstrap.Modal(modal);
      modalInstance.show();
    }
  }

  closeModal() {
    const modal = document.getElementById('addDoctorModal');
    if (modal) {
      const modalInstance = bootstrap.Modal.getInstance(modal);
      if (modalInstance) {
        modalInstance.hide();
      }
    }
    this.doctor = {};
    this.isEditMode = false;
  }

  getTotalStaff(): number {
    return this.departments.reduce((total, department) => total + department.staff_num, 0);
  }
  getTotalBeds(): number {
    return this.departments.reduce((total, department) => total + department.beds_num, 0);
  }
  getTotalequipments(): number {
    return this.departments.reduce((total, department) => total + department.equipments, 0);
  }
}
