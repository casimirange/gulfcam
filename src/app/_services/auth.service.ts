import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable, throwError} from "rxjs";
import {ICredentials} from "../_interfaces/credentials";
import {IToken} from "../_model/token";
import {ICredentialsSignup, ISignup} from "../_model/signup";
import {catchError, tap} from "rxjs/operators";
import {CustomResponse} from "../_interfaces/custom-response";
import {ResetPassword} from "../_model/resetPassword";
import {ForgetPassword} from "../_interfaces/forget-password";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(credentials: ICredentials): Observable<any>{
    return this.http.post<any>(environment.signin, credentials);
  }

  // refreshToken(token: any): Observable<any>{
  //   return this.http.get<any>(environment.refresh+`?${token}`,);
  // }

  forgetPassword(email: ForgetPassword): Observable<any>{
    return this.http.post<any>(environment.resetPassword, email);
  }

  resetPassword(reset: ResetPassword, code: string): Observable<any>{
    return this.http.put<any>(environment.resetPassword+ `?code=${code}`, reset);
  }

  login$ = (credentials: ICredentials) => <Observable<any>> this.http.post<any>(environment.signin, credentials)
    .pipe(tap(console.log), catchError(this.handleError));

  signup$ = (credentials: ICredentialsSignup) => <Observable<CustomResponse<ISignup>>> this.http.post<CustomResponse<ISignup>>(environment.signup, credentials)
    .pipe(tap(console.log), catchError(this.handleError));


  signup(credentials: any): Observable<any>{
    return this.http.post<any>(environment.signup, credentials);
  }

  verifyOtp(code: string): Observable<any>{
    let queryParams = new HttpParams();
    queryParams = queryParams.append("code",code);
    return this.http.get<any>(environment.verification, {params:queryParams});
  }

  newOtpCode(newParam: any): Observable<any>{
    return this.http.post<any>(environment.sendOtp, newParam);
  }

  // pour capturer les messages d'erreur provenant du serveur (backend)
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError(`An error occured - Error code: ${error.status}`);
  }
}
