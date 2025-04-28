import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';

interface Doctor {
    id: number;
    name: string;
    email: string;
    specialization: string;
    experience: number;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface Appointment {
    id: number;
    user_id: number;
    doctor_id: number;
    date: string;
    time: string;
    status: string;
}

interface Department {
    id: number;
    dep_name: string;
    staff_num: number;
    beds_num: number;
    equipments: number;
}

declare const bootstrap: any;

@Component({
    selector: 'app-dashboard-overview',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dashboard-overview.component.html',
    styleUrls: ['./dashboard-overview.component.scss']
})
export class DashboardOverviewComponent implements OnInit {
    users: User[] = [];
    doctors: Doctor[] = [];
    appointments: Appointment[] = [];
    isLoading: boolean = true;
    errorMessage: string = '';
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
        this.fetchDataFromDatabase();
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


    fetchDataFromDatabase() {
        this.http.get<any>('http://localhost/Test php/get_users.php').subscribe({
            next: (response) => {
                if (response.status === 'success') {
                    this.users = response.users || [];
                    this.doctors = response.doctors || [];
                    this.appointments = response.appointments || [];
                    console.log('Users:', this.users);
                    console.log('Doctors:', this.doctors);
                    console.log('Appointments:', this.appointments);
                } else {
                    console.error('Invalid response format:', response);
                }
                this.isLoading = false;
            },
            error: (error) => {
                console.error('Error fetching data:', error);
                this.errorMessage = 'Failed to load data. Please try again later.';
                this.isLoading = false;
            }
        });
    }
}


