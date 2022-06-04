import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { CrudService } from './modules/components/services/crud-service';

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
    console.log('userId',this.userID);
  }

  ngOnInit(): void {

  }
}
