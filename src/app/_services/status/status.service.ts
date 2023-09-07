import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  private status: string;
  constructor() { }

  allStatus(st: string): string{
    switch (st) {
      case 'CREATED': this.status = 'CREE(E)'
        break;
      case 'CANCELED': this.status = 'ANNULE(E)'
        break;
      case 'ACCEPTED': this.status = 'ACCEPTE'
        break;
      case 'CLOSED': this.status = 'TERMINEE'
        break;
      case 'DELETED': this.status = 'SUPPRIME(E)'
        break;
      case 'IN_PROCESS_OF_DELIVERY': this.status = 'EN COURS DE LIVRAISON'
        break;
      case 'DELIVERED': this.status = 'LIVREE'
        break;
      case 'ACTIVATED': this.status = 'ACTIVE(E)'
        break;
      case 'DISABLED': this.status = 'DESACTIVE'
        break;
      case 'SUSPENDED': this.status = 'SUSPENDU'
        break;
      case 'AVAILABLE': this.status = 'DISPONIBLE'
        break;
      case 'USED': this.status = 'UTILISE'
        break;
      case 'STORE_ENABLE': this.status = 'CREEE'
        break;
    }

    return this.status
  }
}
