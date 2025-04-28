import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { HomeProcessComponent } from './pages/home/home-process/home-process.component';
import { DoctorsComponent } from './pages/dashboard/doctors/doctors.component';
import { DepartmentsComponent } from './pages/dashboard/departments/departments.component';
import { PatientsComponent } from './pages/dashboard/patients/patients.component';
export const routes: Routes = [
    {path: "", component: HomeComponent},
    {path: "dashboard", component: DashboardComponent},
    {path: "login", component: LoginComponent},
    {path: "home-process", component: HomeProcessComponent},
    {path: "doctors" , component: DoctorsComponent},
    {path: "signup" , component: SignupComponent},
    {path: 'departments' , component:DepartmentsComponent},
    {path: "patients" , component: PatientsComponent}
];
