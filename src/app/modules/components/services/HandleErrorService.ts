import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { HttpErrorResponse  } from '@angular/common/http';

@Injectable({
    providedIn: "root"
})
export class HandleErrorService {
    constructor(private toaster: ToastrService) {}

    public handleError(err: HttpErrorResponse) {
        let errorMessage: string;
        if(err.error instanceof ErrorEvent) {
            errorMessage = 'An error occured: ${err.error.message}';       
        } else {
            switch(err.status) {
                case 400:
                    errorMessage = `${err.status}: Bad Request`;
                    break;
                case 401:
                    errorMessage = `${err.status}: You are unauthorized to do this action`;
                    break;
                case 403:
                    errorMessage = `${err.status}: You don't have permissoin to access the requested resource.`;
                    break;
                case 404:
                    errorMessage = `${err.status}: The requested resource does not exist`;
                    break;
                case 412:
                    errorMessage = `${err.status}: Precondition Failed`;
                    break;
                case 500:
                    errorMessage = `${err.status}: Internal Server errort`;
                    break;
                case 503:
                    errorMessage = `${err.status}: The requested service is not available`;
                    break;
                default:
                    errorMessage = `Something went wrong`;
                    break;
            }
        }
        this.toaster.error(errorMessage);
    }
    
}
