import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { CrudService } from './../../services/crud-service';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-sanction-letter-pdf',
  templateUrl: './sanction-letter-pdf.component.html',
  styleUrls: ['./sanction-letter-pdf.component.scss']
})
export class SanctionLetterPdfComponent implements OnInit {
  userID;
  pdfSrc!: string;
  verification: boolean = false;
  verification__url = '/user/sanction/esign';
  constructor(private primengConfig: PrimeNGConfig,
    private CrudService: CrudService, private toaster: ToastrService, private router: Router, 
    private activatedRoute: ActivatedRoute) {
      this.userID = this.activatedRoute.snapshot.queryParams.id;
    }

  ngOnInit(): void {
    if(this.userID) {
      debugger;
      this.CrudService.getUserStatus(this.userID).subscribe(
        (response: any) => {
          if(response.status == true) {
            if(response.data.is_esigned == false) {
              this.pdfSrc = response.data.sanction_lettter_url;
              this.verification = true;
            } else {
              this.pdfSrc = response.data.sanction_lettter_singned_url; 
            }
          }
        })
    }
  }

  doEsign() {
    let verificationObj = {
      id: this.userID
    }
    this.CrudService.post(verificationObj, this.verification__url).subscribe(
      (response: any) => {
        if(response.status == true) {
          this.toaster.success(response.msg);
          this.verification = true;
        } else {
          this.toaster.error(response.msg); 
        }
    })
  }


}
