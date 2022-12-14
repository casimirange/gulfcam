import {Client} from "./client";
import {Status} from "./status";

export class RequestOpposition{
    id?:	number
    internalReference?: number
    idClient:	number
    idManagerCoupon?:	number
    idServiceClient?:	number
    status?:	Status
    reason?:	string
    description?:	string
    createdAt?:	string
    updateAt?:	string
    serialCoupons: number[]
    nameClient?: string
    nameManagerCoupon?: string
    nzmeServiceClient?: string
  }

