import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {CustomResponse} from "../../_interfaces/custom-response";
import {environment} from "../../../environments/environment";
import {catchError} from "rxjs/operators";
import {Pret} from "../../_model/pret";

@Injectable({
  providedIn: 'root'
})
export class PretsService {

  constructor(private http: HttpClient) { }

  prets$ = (userFilter?: string, type?: string, date?: string, page?: number, size?: number) => <Observable<CustomResponse<Pret>>>
    this.http.get<CustomResponse<Pret>>(environment.pret + `?page=${page}&size=${size}&name=${userFilter}&type=${type}&date=${date}`,)
      .pipe(catchError(this.handleError));

  rembourserPret$ = (pret: any, idPret: number) => <Observable<any>>
    this.http.put<any>(environment.pret+`/rembourser/${idPret}`, pret).pipe(catchError(this.handleError));


  handleError(error: HttpErrorResponse): Observable<never>{
    return throwError(`Une erreur est survenue: ${error.error.message }` )
  }
}
