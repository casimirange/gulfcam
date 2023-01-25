import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ICredentials} from "../../_interfaces/credentials";
import {Observable} from "rxjs";
import {IToken} from "../../_model/token";
import {environment} from "../../../environments/environment";
import {ISignup} from "../../_model/signup";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any>{
    return this.http.get<any>(environment.users);
  }

  getAllUsersWithPagination(page: number, size: number): Observable<any>{
    return this.http.get<any>(environment.users+ `?page=${page}&size=${size}`)
  }

  getUser(internalRef: number): Observable<any>{
    return this.http.get<any>(environment.users + `/${internalRef}`);
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

}
