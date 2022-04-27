import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class CrudService {
    http;
    baseurl: string = "http://ec2-13-126-45-140.ap-south-1.compute.amazonaws.com/api/v1";
    //  baseurl: string = "http://localhost:8870/api/v1";
    constructor(http: HttpClient) {
        this.http = http;
    }

    post(postData: any, _api_type?: string) {
        return this.http.post(this.baseurl+_api_type,postData)
    }

    get(urlType?: string, id?: any) {
        if(id == undefined) {
            id ='';
        }
        return this.http.get(this.baseurl+urlType+id);
    }

    put(Data: any, _api_type?: string, id?:any) {
        if(id) {
            return this.http.put(this.baseurl+_api_type+id,Data)
        } else {
            return this.http.put(this.baseurl+_api_type,Data)
        }

    }

    getLoanList(id?: number) {
        if(id) {
            return this.http.get(this.baseurl+'' + id);
        } else {
            return this.http.get(this.baseurl+'/loan/list');
        }
    }

    getUserStatus(id?: any) {
        return this.http.get(this.baseurl+'/user/status/' + id);
    }


}
