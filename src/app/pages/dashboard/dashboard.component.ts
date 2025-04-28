import { Component} from '@angular/core';
import { DashboardOverviewComponent } from './dashboard-overview/dashboard-overview.component';
import { RecentAppointmentsComponent } from './recent-appointments/recent-appointments.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [NavbarComponent,DashboardOverviewComponent , RecentAppointmentsComponent],
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent{

}
