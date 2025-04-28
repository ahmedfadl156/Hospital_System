import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

declare const bootstrap: any;

@Component({
  selector: 'app-all-doctors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './all-doctors.component.html',
  styleUrl: './all-doctors.component.scss'
})
export class AllDoctorsComponent implements OnInit {
  doctors: any[] = [];
  doctor: any = {};
  isEditMode: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchDataFromDatabase();
  }

  fetchDataFromDatabase() {
    this.http.get<any>('http://localhost/Test php/get_users.php').subscribe(
      (response) => {
        this.doctors = response.doctors; 
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  AddDoctor() {
    const doctorData = {
      name: this.doctor.name,
      email: this.doctor.email,
      specialization: this.doctor.specialization,
      experience: this.doctor.experience
    };

    console.log('Doctor Data:', doctorData);

    this.http.post('http://localhost/Test php/adddoctor.php' , doctorData).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.doctors.push({
            id: response.id,
            name: doctorData.name,
            email: doctorData.email,
            specialization: doctorData.specialization,
            experience: doctorData.experience,
            status: 'active'
          });
          this.closeModal();
        }
      },
      (error) => {
        console.error('Error adding doctor:', error);
      }
    );
  }

  editDoctor(doctor: any) {
    this.isEditMode = true;
    this.doctor = { ...doctor };
    this.openModal();
  }

  updateDoctor() {
    const doctorData = {
      id: this.doctor.id,
      name: this.doctor.name,
      email: this.doctor.email,
      specialization: this.doctor.specialization,
      experience: this.doctor.experience
    };

    this.http.post('http://localhost/Test php/update_doctor.php', doctorData).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          const index = this.doctors.findIndex(d => d.id === this.doctor.id);
          if (index !== -1) {
            this.doctors[index] = { ...this.doctor };
          }
          this.closeModal();
        }
      },
      (error) => {
        console.error('Error updating doctor:', error);
      }
    );
  }

  deleteDoctor(doctor: any) {
    if (confirm('Are you sure you want to delete this doctor?')) {
      this.http.post('http://localhost/Test php/delete_doctor.php', { id: doctor.id }).subscribe(
        (response: any) => {
          if (response.status === 'success') {
            this.doctors = this.doctors.filter(d => d.id !== doctor.id);
          }
        },
        (error) => {
          console.error('Error deleting doctor:', error);
        }
      );
    }
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
}
