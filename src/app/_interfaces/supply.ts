import {Store} from "./store";
import {IUser} from "./user";

export class  Supply{
  id?: number;
  internalReference?: number;
  idStoreKeeper: number;
  idStoreHouseStockage: number;
  idStoreHouseSell: number;
  createdAt?: Date;
  updateAt?: Date;
  status?: Status;
  serialTo: number;
  number: number;
  serialFrom: number;
  typeVoucher: number;
  from: number;
  to: number;
}

export class Status{
  name: string;
  description: string;
  id: number
}