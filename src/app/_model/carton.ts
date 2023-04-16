import {IUser} from "./user";
import {Status} from "./status";
import {StoreHouse} from "./storehouse";

export class Carton{
  id?: number;
  internalReference?: number;
  idStoreHouseStockage: number;
  idStoreHouseSell?: number;
  idSpaceManager1: number;
  storeKeeper?: IUser;
  nameStoreHouse?: string;
  createdAt?: Date;
  updateAt?: Date;
  status?: Status;
  storeHouse?: StoreHouse;
  serialTo: number;
  number: number;
  serialFrom: number;
  typeVoucher: number;
  from: number;
  to: number;
}

