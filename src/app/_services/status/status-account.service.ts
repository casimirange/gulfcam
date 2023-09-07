import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatusAccountService {

  private status: string;
  constructor() { }

  allStatus(st: string): string{
    switch (st) {
      case 'MANAGER_SPACES_1': this.status = 'GESTIONNAIRE ESPACE 1'
        break;
      case 'MANAGER_SPACES_2': this.status = 'GESTIONNAIRE ESPACE 2'
        break;
      case 'SALES_MANAGER': this.status = 'DIRECTEUR COMMERCIAL'
        break;
      case 'MANAGER_STATION': this.status = 'GESTIONNAIRE DE STATION'
        break;
      case 'DSI_AUDIT': this.status = 'DSI/AUDIT'
        break;
      case 'TREASURY': this.status = 'CAISSIER/TRESORIER'
        break;
      case 'COMMERCIAL_ATTACHE': this.status = 'ATTACHE COMMERCIAL'
        break;
      case 'POMPIST': this.status = 'POMPISTE'
        break;
      case 'COMPTABLE': this.status = 'COMPTABLE'
        break;
    }
    return this.status
  }
}
