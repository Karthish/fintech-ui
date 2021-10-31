import { Component, OnInit } from '@angular/core';
import { CrudService } from './../../services/crud-service';
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-loan-offers',
  templateUrl: './loan-offers.component.html',
  styleUrls: ['./loan-offers.component.scss']
})
export class LoanOffersComponent implements OnInit {

  funding_options_list_details!: any;
  userID;
  submitDetails: boolean = false;
  
  constructor(private CrudService: CrudService, private toaster: ToastrService, 
    private router: Router, private activatedRoute: ActivatedRoute) {
      this.userID = this.activatedRoute.snapshot.queryParams.id;
    }

  ngOnInit(): void {

    if(this.userID) {
      this.CrudService.getUserStatus(this.userID).subscribe(
        (response: any) => {
          if(response.status == true) {
            return;
          } else {
            this.toaster.error(response.msg);
            this.router.navigate(['/loan-info/user-needs']);
          }
        })
    } else {
      this.router.navigate(['/loan-info/user-needs']);
    }
    
    let bank_List_url_type = '/bank/list';
    this.CrudService.get(bank_List_url_type).subscribe(
      (response) => {
        this.funding_options_list_details = response;
        console.log('loanoptions', response);
    })
  }

  update_bank_details(bank_id: string) {
    let update_bank_details = {
      id: this.userID,
      bank_ref_id : bank_id,
    };
    let updateDetails_url_type = '/bank/update';
    debugger;
    console.log('update_bank_details',update_bank_details);
    
    this.submitDetails = true;
    
    this.CrudService.post(update_bank_details, updateDetails_url_type).subscribe(
      (response: any) => {
        console.log('loanoptions', response);
        if(response.status == true) {
          this.toaster.success(response.msg);
          this.router.navigate(['/loan-info/loan-approval'], { queryParams: { id: this.userID } });
          this.submitDetails = false;
        } else {
          this.submitDetails = false;
          this.toaster.error(response.msg);
        }
    })
    
  }

}
