import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

interface Appointment {
  id: number;
  user_name: string;
  doctor_name: string;
  department_name: string;
  date: string;
  time: string;
  status?: string;
}

@Component({
  selector: 'app-recent-appointments',
  standalone: true,
  imports: [CommonModule, ToastModule],
  templateUrl: './recent-appointments.component.html',
  styleUrls: ['./recent-appointments.component.scss'],
  providers: [MessageService]
})
export class RecentAppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private userService: UserService,
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    console.log('Component initialized');
    this.loadAppointments();
  }

  loadAppointments() {
    console.log('Loading appointments...');
    this.isLoading = true;
    this.errorMessage = '';
    
    this.userService.getAppointments().subscribe({
      next: (response) => {
        console.log('Raw Response:', response);
        if (response && response.success) {
          this.appointments = (response.appointments || []).map((appointment: Appointment) => {
            const status = (appointment.status || 'pending').toLowerCase();
            console.log('Processing appointment:', appointment, 'Status:', status);
            return {
              ...appointment,
              status: status
            };
          });
          console.log('Processed Appointments:', this.appointments);
        } else {
          this.errorMessage = response?.error || 'No appointments found';
          console.error('Error in response:', response);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
        this.errorMessage = 'Failed to load appointments. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  updateAppointmentStatus(appointment: Appointment, newStatus: string) {
    const appointmentData = {
      id: appointment.id,
      status: newStatus
    };

    this.http.post('http://localhost/Test php/update_appointment_status.php', appointmentData).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          appointment.status = newStatus;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Appointment ${newStatus} successfully`,
            life: 3000
          });
          this.loadAppointments();
        }
      },
      (error) => {
        console.error('Error updating appointment status:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update appointment status',
          life: 3000
        });
      }
    );
  }

  approveAppointment(appointment: Appointment) {
    console.log('Approving appointment:', appointment);
    const appointmentData = {
        id: appointment.id,
        status: 'accepted'
    };

    this.http.post('http://localhost/Test php/update_appointment_status.php', appointmentData)
        .subscribe({
            next: (response: any) => {
                console.log('Update response:', response);
                if (response.status === 'success') {
                    appointment.status = 'accepted';
                    console.log('Adding success message');
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Appointment approved successfully',
                        life: 3000
                    });
                } else {
                    console.log('Adding error message:', response.message);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: response.message || 'Failed to approve appointment',
                        life: 3000
                    });
                }
            },
            error: (error) => {
                console.error('Error approving appointment:', error);
                console.log('Adding error message for HTTP error');
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to approve appointment',
                    life: 3000
                });
            }
        });
  }

  rejectAppointment(appointment: Appointment) {
    console.log('Rejecting appointment:', appointment);
    const appointmentData = {
        id: appointment.id,
        status: 'rejected'
    };

    this.http.post('http://localhost/Test php/update_appointment_status.php', appointmentData)
        .subscribe({
            next: (response: any) => {
                console.log('Update response:', response);
                if (response.status === 'success') {
                    appointment.status = 'rejected';
                    console.log('Adding success message');
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Appointment rejected successfully',
                        life: 3000
                    });
                } else {
                    console.log('Adding error message:', response.message);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: response.message || 'Failed to reject appointment',
                        life: 3000
                    });
                }
            },
            error: (error) => {
                console.error('Error rejecting appointment:', error);
                console.log('Adding error message for HTTP error');
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to reject appointment',
                    life: 3000
                });
            }
        });
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return 'status-badge accepted';
      case 'rejected':
        return 'status-badge rejected';
      case 'pending':
        return 'status-badge pending';
      default:
        return 'status-badge pending';
    }
  }
}
