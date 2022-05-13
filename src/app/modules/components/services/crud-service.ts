import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../../../environments/environment';

@Injectable()
export class CrudService {
    private API_URL= environment.apiUrl;
    http;
    constructor(http: HttpClient) {
        this.http = http;
    }

    post(postData: any, _api_type?: string) {
        return this.http.post(this.API_URL+_api_type,postData)
    }

    get(urlType?: string, id?: any) {
        if(id == undefined) {
            id ='';
        }
        return this.http.get(this.API_URL+urlType+id);
    }

    put(Data: any, _api_type?: string, id?:any) {
        if(id) {
            return this.http.put(this.API_URL+_api_type+id,Data)
        } else {
            return this.http.put(this.API_URL+_api_type,Data)
        }

    }

    getLoanList(id?: number) {
        if(id) {
            return this.http.get(this.API_URL+'' + id);
        } else {
            return this.http.get(this.API_URL+'/loan/list');
        }
    }

    getUserStatus(id?: any) {
        return this.http.get(this.API_URL+'/user/status/' + id);
    }


}
