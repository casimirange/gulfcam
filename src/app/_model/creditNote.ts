import {Status} from "./status";
import {Coupon} from "./coupon";
import {Station} from "./station";

export class CreditNote{
  id?:	number
  internalReference?: number
  // idClient:	number
  idStation:	string
  coupon:	Coupon[]
  coupons:	Coupon[]
  station:	Station
  status?:	Status
  createdAt?:	string
  updateAt?:	string
  serialCoupons: string[]
}
