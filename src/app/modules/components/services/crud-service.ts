import { HttpClient, HttpResponse  } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class CrudService {
    http;
    baseurl: string = "https://ec2-13-126-45-140.ap-south-1.compute.amazonaws.com/api/v1"; 

    constructor(http: HttpClient) {
        this.http = http;
    }

    post(postData: any, _api_type?: string) {
        return this.http.post(this.baseurl+_api_type,postData)
    }

    get(id?: number) {
        if(id) {
            return this.http.get(this.baseurl+'/loan/list' + id);
        } else {
            return this.http.get(this.baseurl+'/loan/list');
        }
    }

}