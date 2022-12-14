import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {TypeVoucher} from "../../_model/typeVoucher";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class VoucherService {

  constructor(private http: HttpClient) { }

  createTypevoucher(tVoucher: TypeVoucher): Observable<any>{
    return this.http.post<any>(environment.typeVoucher, tVoucher)
  }

  getTypevoucher(): Observable<any>{
    return this.http.get<any>(environment.typeVoucher)
  }

  getTypevoucherByInternalRef(internalRef: number): Observable<any>{
    return this.http.get<any>(environment.typeVoucher+`/${internalRef}`)
  }

  deleteTypevoucher(internalref: number): Observable<any>{
    return this.http.delete<any>(environment.typeVoucher+`/${internalref}`)
  }

  updateTypeVoucher(tVoucher: any, internalRef: number): Observable<any>{
    return this.http.put<any>(environment.typeVoucher+`/${internalRef}`, tVoucher);
  }
}
