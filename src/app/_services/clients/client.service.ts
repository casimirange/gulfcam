import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable, Subject, throwError} from "rxjs";
import {Client} from "../../_model/client";
import {Products} from "../../_model/products";
import {CustomResponse} from "../../_interfaces/custom-response";
import {catchError} from "rxjs/operators";
import {Coupon} from "../../_model/coupon";

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }

  getAllClients(): Observable<any>{
    return this.http.get<any>(environment.client)
  }

  getAllClientsWithPagination(page: number, size: number): Observable<any>{
    return this.http.get<any>(environment.client+ `?page=${page}&size=${size}`)
  }

  searchClient(completeName: string): Observable<any>{
    return this.http.get<any>(environment.client+ `/like/${completeName}`)
  }

  addClient(client: Client): Observable<Client>{
    return this.http.post<Client>(environment.client, client)
  }

  findClient(internalRef: string): Observable<any>{
    return this.http.get<any>(environment.client+`/${internalRef}`)
  }

  deleteClient(internalref: number): Observable<any>{
    return this.http.delete<any>(environment.client+`/${internalref}`)
  }

  updatelient(client: any, internalRef: number): Observable<any>{
    return this.http.put<any>(environment.client+`/${internalRef}`, client);
  }


  /**
   * nouvelle approche clean code
   * @param page
   * @param size
   */


  clients$ = (page: number, size: number) => <Observable<any>>
    this.http.get<any>(environment.client + `?page=${page}&size=${size}`,)
      .pipe(catchError(this.handleError));

  addClient$ = (client: Client) => <Observable<any>>
    this.http.post<any>(environment.client, client)
      .pipe(catchError(this.handleError));

  updateClient$ = (client: Client, internalRef: number) => <Observable<any>>
    this.http.put<any>(environment.client+`/${internalRef}`, client)
      .pipe(catchError(this.handleError));

  deleteClient$ = (internalRef: number) => <Observable<Client>>
    this.http.delete<Client>(environment.client+`/${internalRef}`)
      .pipe(catchError(this.handleError));

  showClient$ = (internalRef: string) => <Observable<any>>
    this.http.get<any>(environment.client+`/${internalRef}`)
      .pipe(catchError(this.handleError));

  filterClient$ = (companyName?: string, type?: string, clientName?: string, date?: string, page?: number, size?: number) => <Observable<any>>
    this.http.get<any>(environment.client + `/filter?page=${page}&size=${size}&company=${companyName}&date=${date}&name=${clientName}&type=${type}`,)
      .pipe(catchError(this.handleError));

  handleError(error: HttpErrorResponse): Observable<never>{
    return throwError(`Une erreur est survenue: ${error.error.message.toString().bold()}` )
  }
}
