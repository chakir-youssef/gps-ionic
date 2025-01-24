import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {DeviceData} from "../../types";
@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private apiUrl = 'http://localhost:3000/api/data';

  constructor(private http: HttpClient) {}


  getData(): Observable<DeviceData[]> {
    return this.http.get<DeviceData[]>(this.apiUrl);
  }
}
