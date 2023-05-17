import {Status} from "./status";
import {Coupon} from "./coupon";

export class Ticket{
  id?:	number
  internalReference?: number
  idCoupon:	number
  coupon?:	Coupon
  idRequestOpposition: number
  status?:	Status
  createdAt?:	string
  updateAt?:	string

  serialNumber?: string;

  nameClient?: string;

  notebookNumber?: string;

  amount?: number;

}
