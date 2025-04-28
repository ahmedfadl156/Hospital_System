import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  showSuccessAlert = false;
  showDangerAlert = false;

  constructor(private userService: UserService, private router: Router) {}

  onSubmit() {
    this.userService.signup(this.name, this.email, this.password).subscribe(
      (response) => {
        console.log('Signup Response:', response);
        if (response.success) {
          this.showSuccessAlert = true;
          this.errorMessage = 'Registration successful! Redirecting to login Page...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        } else {
          this.showDangerAlert = true;
          this.errorMessage = response.message || 'Registration failed';
        }
      },
      (error) => {
        console.error('Signup error:', error);
        this.showDangerAlert = true;
        this.errorMessage = 'An error occurred during registration';
      }
    );
  }
}
