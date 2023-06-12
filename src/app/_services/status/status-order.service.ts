import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatusOrderService {

  private status: string;
  constructor() { }

  allStatus(st: string): string{
    switch (st) {
      case 'CREATED': this.status = 'CREEE'
        break;
      case 'ORDER_COMPLETED': this.status = 'TERMINEE'
        break;
      case 'PAID': this.status = 'PAYEE'
        break;
      case 'CANCELED': this.status = 'ANNULEE'
        break;
      case 'ACCEPTED': this.status = 'ACCEPTEE'
        break;
      case 'IN_PROCESS_OF_DELIVERY': this.status = 'EN COURS DE LIVRAISON'
        break;
      case 'CLOSED': this.status = 'TERMINEE'
        break;
      case 'INVOICE': this.status = 'FACTUREE'
        break;
    }
    return this.status
  }
}
