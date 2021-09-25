import { HttpClient, HttpResponse  } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class CrudService {
    http;

    constructor(http: HttpClient) {
        this.http = http;
    }

    getCust(id?: number) {
        if(id) {
            return this.http.get('http://ec2-35-154-162-207.ap-south-1.compute.amazonaws.com/api/v1/loan/list' + id);
        } else {
            return this.http.get('http://ec2-35-154-162-207.ap-south-1.compute.amazonaws.com/api/v1/loan/list');
        }
    }

}