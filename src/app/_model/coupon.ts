import {Store} from "./store";
import {Status} from "./status";
import {Client} from "./client";
import {Ticket} from "./ticket";

export class Coupon{
  id?: number;
  internalReference?: number;
  idClient?: number;
  idTicket?: number;
  idNotebook: number;
  idStation?: number;
  idPompist?: number;
  idTypeVoucher?: number;
  idRequestOpposition?: number;
  idCreditNote?: number;
  serialNumber: string;
  pompisteName: string;
  createdAt?: Date;
  updateAt?: Date;
  status?: Status;
  amount: number;
  nameClient: string;
  nameStation: string;
  ticket: Ticket;
  productionDate: Date
}
