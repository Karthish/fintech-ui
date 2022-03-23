
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: "root"
})
export class EarlySalaryService {
   private EarlySalaryData = new Subject<any>();
   EarlySalary$ = this.EarlySalaryData.asObservable();
   EarlySalaryDataUpdated: any;
   early_salary_bank_updated!: boolean;
   
   constructor() {}

   passEarlySalary(data: any, early_salary_bank: boolean) {
       debugger;
       this.EarlySalaryDataUpdated = data;
       this.early_salary_bank_updated = early_salary_bank;
       return this.EarlySalaryDataUpdated;
    // this.EarlySalaryData.next(data);
    // return data;
   }
}
