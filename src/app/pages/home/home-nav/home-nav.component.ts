import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home-nav',
  imports: [RouterModule, CommonModule , SweetAlert2Module],
  templateUrl: './home-nav.component.html',
  styleUrl: './home-nav.component.scss'
})
export class HomeNavComponent {
  constructor(private router: Router) {}

  isLoggedIn(): boolean {
    const loggedIn = !!localStorage.getItem('email');
    return loggedIn; 
  }

  getUserName(): string {
    return localStorage.getItem('userName') || 'User'; 
  }

  logout() {
    localStorage.removeItem('email');
    localStorage.removeItem('userName');
    this.router.navigate(['']);
  }

  handleBookAppointment(event: Event) {
    event.preventDefault();
    if (!this.isLoggedIn()) {
        Swal.fire({
            title: "Error",
            text: "Please Login First",
            icon: "error"
        });
        return;
    } 
    this.router.navigate(['home-process']);
  }
}
