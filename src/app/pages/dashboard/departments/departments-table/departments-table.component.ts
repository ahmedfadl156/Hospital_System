import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

interface Department {
    id: number;
    dep_name: string;
    staff_num: number;
    beds_num: number;
    equipments: number;
}

@Component({
    selector: 'app-departments-table',
    standalone: true,
    imports: [TableModule, ButtonModule, DialogModule, InputTextModule, FormsModule],
    templateUrl: './departments-table.component.html',
    styleUrls: ['./departments-table.component.scss']
})
export class DepartmentsTableComponent implements OnInit {
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

    openNew() {
        this.department = {
            id: 0,
            dep_name: '',
            staff_num: 0,
            beds_num: 0,
            equipments: 0
        };
        this.submitted = false;
        this.departmentDialog = true;
    }

    editDepartment(department: Department) {
        this.department = { ...department };
        this.departmentDialog = true;
    }

    deleteSelectedDepartments() {
        if (this.selectedDepartments.length > 0) {
            const confirmDelete = confirm('Are you sure you want to delete the selected departments?');
            if (confirmDelete) {
                this.selectedDepartments.forEach(department => {
                    this.deleteDepartment(department.id);
                });
                this.selectedDepartments = [];
            }
        }
    }

    deleteDepartment(id: Number) {
        this.http.delete('http://localhost/Test php/departments.php', { body: { id: id } })
            .subscribe({
                next: (response: any) => {
                    if (response.status === 'success') {
                        this.departments = this.departments.filter(d => d.id !== id);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Department deleted successfully'
                        });
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: response.message || 'Failed to delete department'
                        });
                    }
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to delete department: ' + error.message
                    });
                }
            });
    }

    hideDialog() {
        this.departmentDialog = false;
        this.submitted = false;
    }

    saveDepartment() {
        this.submitted = true;

        if (this.department.dep_name.trim()) {
            if (this.department.id) {
                this.http.put('http://localhost/Test php/departments.php', this.department)
                    .subscribe({
                        next: (response: any) => {
                            if (response.status === 'success') {
                                const index = this.departments.findIndex(d => d.id === this.department.id);
                                if (index !== -1) {
                                    this.departments[index] = { ...this.department };
                                }
                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Success',
                                    detail: 'Department updated successfully'
                                });
                                this.departmentDialog = false;
                                this.department = {
                                    id: 0,
                                    dep_name: '',
                                    staff_num: 0,
                                    beds_num: 0,
                                    equipments: 0
                                };
                            } else {
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: response.message || 'Failed to update department'
                                });
                            }
                        },
                        error: (error) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Failed to update department: ' + error.message
                            });
                        }
                    });
            } else {
                this.http.post('http://localhost/Test php/departments.php', this.department)
                    .subscribe({
                        next: (response: any) => {
                            if (response.status === 'success') {
                                this.department.id = response.id;
                                this.departments.push({ ...this.department });
                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Success',
                                    detail: 'Department added successfully'
                                });
                                this.departmentDialog = false;
                                this.department = {
                                    id: 0,
                                    dep_name: '',
                                    staff_num: 0,
                                    beds_num: 0,
                                    equipments: 0
                                };
                            } else {
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: response.message || 'Failed to add department'
                                });
                            }
                        },
                        error: (error) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Failed to add department: ' + error.message
                            });
                        }
                    });
            }
        }
    }
}
