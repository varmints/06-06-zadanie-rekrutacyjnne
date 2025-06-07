import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetItemsResponse } from '../models/get-items-response.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  private apiUrl = `${environment.apiUrl}/items`;

  constructor(private http: HttpClient) {}

  getItems(params: any): Observable<GetItemsResponse> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        httpParams = httpParams.set(key, params[key].toString());
      }
    });
    return this.http.get<GetItemsResponse>(this.apiUrl, { params: httpParams });
  }
}
