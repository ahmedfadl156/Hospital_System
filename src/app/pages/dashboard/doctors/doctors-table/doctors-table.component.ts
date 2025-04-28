import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { TableModule, Table } from 'primeng/table';
import { InputIconModule } from 'primeng/inputicon';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-doctors-table',
    standalone: true,
    imports: [CommonModule, RadioButtonModule, SelectButtonModule, ButtonModule, ToolbarModule, ToastModule, FileUploadModule, TableModule, InputIconModule, RatingModule, TagModule, DialogModule, DropdownModule, InputNumberModule, ConfirmDialogModule, FormsModule],
    templateUrl: './doctors-table.component.html',
    styleUrls: ['./doctors-table.component.scss'],
    providers: [MessageService, ConfirmationService],
})
export class DoctorsTableComponent implements OnInit {
    doctors: any[] = [];
    selectedDoctors: any[] | null = null;
    doctorDialog: boolean = false;
    doctor: any = {};
    submitted: boolean = false;
    loading: boolean = false;
    @ViewChild('dt') dt!: Table;
    statuses: any[] = [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'On Leave', value: 'onleave' }
    ];

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private http: HttpClient
    ) {}

    ngOnInit() {
        this.fetchDataFromDatabase();
    }

    fetchDataFromDatabase() {
        this.loading = true;
        this.http.get<any>('http://localhost/Test php/get_users.php').subscribe(
            (response) => {
                if (response && response.doctors) {
                    this.doctors = response.doctors.map((doc: any) => {
                        if (doc.speciality && !doc.specialty) {
                            doc.specialty = doc.speciality;
                        }
                        return doc;
                    });
                }
                this.loading = false;
            },
            (error) => {
                console.error('Error fetching data:', error);
                this.loading = false;
            }
        );
    }

    onGlobalFilter(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        if (this.dt) {
            this.dt.filterGlobal(value, 'contains');
        }
    }

    openNew() {
        this.doctor = {
            status: 'inactive' 
        };
        this.submitted = false;
        this.doctorDialog = true;
    }

    editDoctor(doctor: any) {
        this.doctor = { ...doctor };
        
        if (doctor.speciality && !this.doctor.specialty) {
            this.doctor.specialty = doctor.speciality;
        }
        
        this.doctorDialog = true;
    }

    hideDialog() {
        this.doctorDialog = false;
        this.submitted = false;
    }

    deleteDoctor(doctor: any) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this doctor?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                
                const doctorId = doctor.ID || doctor.id;
                
                
                const httpOptions = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                
                this.http.post('http://localhost/Test php/deletedoctor.php', 
                              { id: doctorId }, 
                              httpOptions)
                    .subscribe({
                        next: (response: any) => {
                            if (response.status === 'success') {
                                this.doctors = this.doctors.filter((val) => 
                                    (val.ID || val.id) !== doctorId);
                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Successful',
                                    detail: 'Doctor Deleted',
                                    life: 3000
                                });
                            } else {
                                console.error('Error response:', response);
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: response.message || 'Failed to delete doctor',
                                    life: 3000
                                });
                            }
                        },
                        error: (error) => {
                            console.error('Error deleting doctor:', error);
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Failed to delete doctor',
                                life: 3000
                            });
                        }
                    });
            }
        });
    }
    
    getSeverity(status: string) {
        switch (status) {
            case 'active':
                return 'success';
            case 'inactive':
                return 'warn';
            case 'onleave':
                return 'info';
            default:
                return 'info';
        }
    }

    saveDoctor() {
        this.submitted = true;

        if (!this.doctor.name?.trim()) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Doctor name is required',
                life: 3000
            });
            return;
        }

        const doctorData = {
            id: this.doctor.id || this.doctor.ID, 
            name: this.doctor.name,
            email: this.doctor.email,
            specialty: this.doctor.specialty,
            yearsOfExperience: this.doctor.yearsOfExperience,
            status: this.doctor.status
        };


        const httpOptions = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (doctorData.id) {
            this.http.post('http://localhost/Test php/updatedoctor.php', doctorData, httpOptions)
                .subscribe({
                    next: (response: any) => {
                        if (response.status === 'success') {
                            const index = this.doctors.findIndex(d => (d.id === doctorData.id || d.ID === doctorData.id));
                            if (index !== -1) {
                                this.doctors[index] = { ...doctorData };
                            }
                            
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Successful',
                                detail: 'Doctor Updated',
                                life: 3000
                            });
                            this.doctorDialog = false;
                            this.doctor = {};
                            
                            this.fetchDataFromDatabase();
                        } else {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: response.message || 'Failed to update doctor',
                                life: 3000
                            });
                        }
                    },
                    error: (error) => {
                        console.error('Error updating doctor:', error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to update doctor',
                            life: 3000
                        });
                    }
                });
        } else {
            this.http.post('http://localhost/Test php/adddoctor.php', doctorData, httpOptions)
                .subscribe({
                    next: (response: any) => {
                        if (response.status === 'success') {
                            doctorData.id = response.id;
                            
                            this.doctors.push({ ...doctorData });
                            
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Successful',
                                detail: 'Doctor Created',
                                life: 3000
                            });
                            this.doctorDialog = false;
                            this.doctor = {};
                            
                            this.fetchDataFromDatabase();
                        } else {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: response.message || 'Failed to create doctor',
                                life: 3000
                            });
                        }
                    },
                    error: (error) => {
                        console.error('Error creating doctor:', error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Failed to create doctor',
                            life: 3000
                        });
                    }
                });
        }
    }
}