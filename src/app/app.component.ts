import { Component, OnInit } from '@angular/core';
import { CrudService } from './modules/components/services/crud-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'fintech-ui';
  userID;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private CrudService: CrudService, 
    private toaster: ToastrService) {
    this.userID = this.activatedRoute.snapshot.queryParams.id
  }

  ngOnInit(): void {
    if(this.userID) {
      this.CrudService.getUserStatus(this.userID).subscribe(
        (response: any) => {
          if(response.status == true) {
            if(response.data.next_page == "aadhar-verification" || "cust-details") {
              this.router.navigate(['/loan-info/user-authentication'], { queryParams: { id: this.userID } });
            } else if(response.data.next_page == "loan-offer-list") {
              this.router.navigate(['/loan-info/loan-offers'], { queryParams: { id: this.userID } });
            } else if(response.data.next_page == "loan-offer-details") {
              this.router.navigate(['/loan-info/loan-approval'], { queryParams: { id: this.userID } });
            } else {
              this.toaster.error(response.msg);
              this.router.navigate(['/loan-info/user-needs']);
            }
          } 
        })
      
    } else {
      this.router.navigate(['/loan-info/user-needs']);
    }
    
  }
}
