import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {ICredentials} from "../../_interfaces/credentials";
import {Observable, throwError} from "rxjs";
import {IToken} from "../../_model/token";
import {environment} from "../../../environments/environment";
import {ISignup} from "../../_model/signup";
import {CustomResponse} from "../../_interfaces/custom-response";
import {Order} from "../../_model/order";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any>{
    return this.http.get<any>(environment.users);
  }

  users$ = (firstname?: string, lastname?: string, type?: string, status?: string, idStore?: string, page?: number, size?: number) => <Observable<CustomResponse<ISignup>>>
    this.http.get<CustomResponse<ISignup>>(environment.users + `/filter?page=${page}&size=${size}&firstName=${firstname}&lastName=${lastname}&typeAccount=${type}&status=${status}&store=${idStore}`,)
      .pipe(catchError(this.handleError));

  getAllUsersWithPagination(page: number, size: number): Observable<any>{
    return this.http.get<any>(environment.users+ `?page=${page}&size=${size}`)
  }

  getUser(internalRef: number): Observable<any>{
    return this.http.get<any>(environment.users + `/${internalRef}`);
  }

  getUsersByTypeAccount(type: string): Observable<any>{
    return this.http.get<any>(environment.users + `/typeaccount/${type}`);
  }

  enableDesable(internalRef: number, status: boolean): Observable<any>{
    return this.http.get<any>(environment.users + `/lockAndUnlockAccount/${internalRef}/${status}`);
  }

  updateUser(user: any): Observable<any>{
    return this.http.put<any>(environment.users, user);
  }

  changePassword(userId: number, body: any): Observable<any>{
    return this.http.put<any>(environment.changePassword + `/${userId}/password-update`, body);
  }

  handleError(error: HttpErrorResponse): Observable<never>{
    return throwError(`Une erreur est survenue: ${error.error.message }` )
  }
}
