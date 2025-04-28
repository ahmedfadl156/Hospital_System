import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; 


@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  showSuccessAlert = false;
  showDangerAlert = false;
  isLoading: boolean = false;

  constructor(private userService: UserService, private router: Router) {}
  onSubmit() {
    this.isLoading = true;
    this.userService.login(this.email, this.password).subscribe(response => {
      if (response.success) {
        localStorage.setItem('email', this.email);
  
        this.userService.getUserByEmail(this.email).subscribe(userResponse => {
          const user = userResponse.users?.find((u: { email: string }) => u.email === this.email);
          if (user) {
            localStorage.setItem('userName', user.name);

            setTimeout(() => {
              this.router.navigate(['']);
            }, 6000);
  
          } else {
            this.isLoading = false;
            this.errorMessage = 'User not found';
            this.showDangerAlert = true;
          }
        }, () => {
          this.isLoading = false;
          this.errorMessage = 'Error fetching user data';
          this.showDangerAlert = true;
        });
  
      } else {
        this.isLoading = false;
        this.errorMessage = response.message;
        this.showDangerAlert = true;
      }
    }, () => {
      this.isLoading = false;
      this.errorMessage = 'An error occurred during login.';
      this.showDangerAlert = true;
    });
  }
  
  
}