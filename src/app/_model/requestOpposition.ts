import {Client} from "./client";
import {Status} from "./status";

export class RequestOpposition{
    id?:	number
    internalReference?: number
    idClient:	number
    idSalesManager?:	number
    idCommercialAttache?:	string
    status?:	Status
    reason?:	string
    description?:	string
    createdAt?:	string
    updateAt?:	string
    serialCoupons: string[]
    nameClient?: string
    nameSaleManager?: string
    nameCommercialAttache?: string
  }

