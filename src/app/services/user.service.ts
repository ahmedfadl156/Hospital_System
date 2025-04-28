import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private signupUrl = 'http://localhost/Test php/signup.php';
  private getUsersUrl = 'http://localhost/Test php/get_users.php';
  private getAppointmentsUrl = 'http://localhost/Test php/getappointments.php';
  private bookAppointmentUrl = 'http://localhost/Test php/add_appointment.php';
  private loginUrl = 'http://localhost/Test php/login.php';

  constructor(private http: HttpClient) {}

  signup(name: string, email: string, password: string): Observable<any> {
    const body = { name, email, password };
    console.log('Sending signup request:', body);
    return this.http.post(this.signupUrl, body);
  }

  getUsers(): Observable<any> {
    return this.http.get<any>(this.getUsersUrl);
  }

  bookAppointment(appointmentData: any): Observable<any> {
    return this.http.post<any>(this.bookAppointmentUrl, appointmentData);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.loginUrl, { email, password });
  }

  getUserByEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.getUsersUrl}?email=${email}`);
  }

  getAppointments(): Observable<any> {
    console.log('Fetching appointments from:', this.getAppointmentsUrl);
    return this.http.get<any>(this.getAppointmentsUrl);
  }
}
