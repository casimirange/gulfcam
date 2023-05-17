import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Products} from "../../_model/products";
import {combineLatest, Observable, of} from "rxjs";
import {environment} from "../../../environments/environment";
import {startWith, switchMap} from "rxjs/operators";
import {TypeVoucher} from "../../_model/typeVoucher";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  joined$: Observable<any>
  constructor(private http: HttpClient) { }

  saveProduct(product: Products): Observable<any>{
    return this.http.post<any>(environment.product, product)
  }

  getProducts(idOrder: string): Observable<any>{
    return this.http.get<any>(environment.product + `/order/${idOrder}`,)
  }

  product$ = (idOrder: number) => <Observable<Products[]>> this.http.get<Products[]>(environment.product + `/order/${idOrder}`,)
    .pipe();
}
