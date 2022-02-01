import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { CrudService } from './../../services/crud-service';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userID;
  dashboard__url = "/user/dashboard/";
  dashboard_details: any;
  next_due_date: any;
  prev_due_date: any;
  outstanding_percentage!: number;

  constructor(private CrudService: CrudService, private toaster: ToastrService,
    private router: Router, private activatedRoute: ActivatedRoute, public datepipe: DatePipe) {
      // this.userID = this.activatedRoute.snapshot.queryParams.id;
      this.userID = "619fc678692bf93788934627";
    }

  ngOnInit(): void {
    this.CrudService.get(this.dashboard__url, this.userID).subscribe(
      (response: any) => {
        if(response.status == true) {
          this.dashboard_details = response.data;
          this.next_due_date = this.dashboard_details.next_due_date;
          this.next_due_date = this.datepipe.transform(this.next_due_date, 'MMM d, y');

          this.prev_due_date = this.dashboard_details.previous_due_date;
          this.prev_due_date = this.datepipe.transform(this.prev_due_date, 'MMM d, y');

          this.outstanding_percentage = this.dashboard_details.current_outstanding / this.dashboard_details.amount_sanctioned * 100
          
          console.log('dashboarddetails',this.dashboard_details )
          
        } else {
          this.toaster.error(response.msg);
        }
    })
  }

}
