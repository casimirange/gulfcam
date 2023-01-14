import {IUser} from "./user";
import {Status} from "./status";

export class Carton{
  id?: number;
  internalReference?: number;
  idStoreHouseStockage: number;
  idStoreHouseSell?: number;
  idStoreKeeper: number;
  storeKeeper?: IUser;
  nameStoreHouse?: string;
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

