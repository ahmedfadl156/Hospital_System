import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { RatingModule } from 'primeng/rating';
import { Rating } from 'primeng/rating';
import { DatePickerModule } from 'primeng/datepicker';
import { DatePicker } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';
interface Doctor {
  id: number;
  name: string;
  email: string;
  specialization: string;
  experience: number;
}

@Component({
  selector: 'app-home-process',
  standalone: true,
  imports: [CommonModule, FormsModule, SweetAlert2Module, Rating, RatingModule, DatePickerModule,DatePicker, FloatLabel],
  templateUrl: './home-process.component.html',
  styleUrl: './home-process.component.scss'
})
export class HomeProcessComponent implements OnInit {
  firstName = '';
  lastName = '';
  department = '';
  time = '';
  email = '';
  doctor = '';
  date = '';
  name = '';
  showSuccessAlert = false;
  showDangerAlert = false;
  doctors: Doctor[] = [];
  selectedDoctor: Doctor | null = null;
  value: number = 0;
  showRating: boolean = false;

  constructor(
    private userService: UserService, 
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.fetchDoctors();
  }

  fetchDoctors() {
    this.http.get<any>('http://localhost/Test php/get_users.php').subscribe({
      next: (response) => {
        if (response.status === 'success' && response.doctors) {
          this.doctors = response.doctors;
        }
      },
      error: (error) => {
        console.error('Error fetching doctors:', error);
      }
    });
  }

  submitAppointment(event: Event) {
    event.preventDefault();
    this.name = `${this.firstName} ${this.lastName}`;

    if (!this.firstName || !this.lastName || !this.department || !this.email || !this.selectedDoctor || !this.date || !this.time) {
      Swal.fire({
        title: "Error",
        text: "Please Fill All Fields!",
        icon: "error"
      });
      return;
    }
    
    const fullName = `${this.firstName} ${this.lastName}`;
    const selectedDate = new Date(this.date);
    const formattedDate = selectedDate.toISOString().split('T')[0];
    
    console.log("Formatted Date:", formattedDate);
    
    const appointmentData = {
      name: fullName,
      time: this.time,
      department: this.department,
      email: this.email,
      doctor: this.selectedDoctor ? `Dr.${this.selectedDoctor.name}` : '',
      created_at: formattedDate,
    };
    
    this.userService.bookAppointment(appointmentData).subscribe(
      response => {
        if (response.status === 'success') {
          this.value = 0;
          
          Swal.fire({
            title: "Success",
            html: `
              <p>Your appointment has been booked successfully! We will contact you Soon ❤️</p>
              <div class="mt-4">
                <p>Please rate our service:</p>
                <div id="customRating" class="d-flex justify-content-center" style="margin: 20px 0;"></div>
              </div>
            `,
            icon: "success",
            showConfirmButton: true,
            confirmButtonText: 'Submit Rating',
            allowOutsideClick: false,
            didOpen: () => {
              const customRating = document.getElementById('customRating');
              if (customRating) {
                const ratingContainer = document.createElement('div');
                ratingContainer.className = 'd-flex justify-content-center';
                ratingContainer.style.gap = '5px';
                
                for (let i = 1; i <= 5; i++) {
                  const star = document.createElement('img');
                  star.src = 'https://primefaces.org/cdn/primeng/images/demo/rating/custom-icon.png';
                  star.width = 24;
                  star.height = 24;
                  star.style.cursor = 'pointer';
                  star.setAttribute('data-value', i.toString());
                  
                  star.addEventListener('click', (e) => {
                    const clickedStar = e.target as HTMLImageElement;
                    const value = parseInt(clickedStar.getAttribute('data-value') || '0');
                    this.value = value;
                    
                    const stars = ratingContainer.querySelectorAll('img');
                    stars.forEach((s, index) => {
                      if (index < value) {
                        s.src = 'https://primefaces.org/cdn/primeng/images/demo/rating/custom-icon-active.png';
                      } else {
                        s.src = 'https://primefaces.org/cdn/primeng/images/demo/rating/custom-icon.png';
                      }
                    });
                  });
                  
                  ratingContainer.appendChild(star);
                }
                
                customRating.appendChild(ratingContainer);
              }
            },
            preConfirm: () => {
              return this.value;
            }
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: "Thank You!",
                text: `Thank you for your feedback! Your rating of ${this.value}/5 helps us improve our services.`,
                icon: "success",
                timer: 5000,
                timerProgressBar: true
              });
              this.resetForm();
            }
          });
        } else {
          Swal.fire({
            title: "Error",
            text: "There Is An Error While Booking Your Appointment Check Inputs And Try Again!",
            icon: "error"
          });
        }
      },
      error => {
        console.error("API Error:", error);
        Swal.fire({
          title: "Error",
          text: "This Email Is Already Exist Go To Login Page!",
          icon: "error"
        });
      }
    );
  }
  

  resetForm() {
    this.firstName = '';
    this.lastName = '';
    this.department = '';
    this.email = '';
    this.doctor = '';
    this.date = '';
    this.selectedDoctor = null;
    this.value = 0;
  }
}