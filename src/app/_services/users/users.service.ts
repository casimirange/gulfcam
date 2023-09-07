import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {CustomResponse} from "../../_interfaces/custom-response";
import {IUser} from "../../_model/user";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any>{
    return this.http.get<any>(environment.users);
  }

  getUserss(): Observable<CustomResponse<IUser>>{
    return this.http.get<CustomResponse<IUser>>(environment.users);
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
