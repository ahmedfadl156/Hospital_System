import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service'; 
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-patients-table',
  standalone: true,
  imports: [NgFor], 
  templateUrl: './patients-table.component.html',
  styleUrls: ['./patients-table.component.scss']
})
export class PatientsTableComponent implements OnInit {
  users: any[] = []; 

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers().subscribe(
      (response: any) => {
        if (response.status === 'success' && Array.isArray(response.users)) {
          this.users = response.users;
        } else {
          console.error('Invalid data format:', response);
        }
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }
}