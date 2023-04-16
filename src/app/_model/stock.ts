import {Store} from "./store";
import {Status} from "./status";
import {StoreHouse} from "./storehouse";

export class Stock {
  id?: number;
  internalReference?: number;
  idStore1?: number;
  idStore2?: number;
  store1?: Store;
  store2?: Store;
  idStoreHouseStockage: number;
  idStoreHouseStockage2?: number;
  listCartons: number[];
  idStoreHouse1?: number;
  idStoreHouse2?: number;
  storeHouse1?: StoreHouse;
  storeHouse2?: StoreHouse;
  idStoreKeeper?: number;
  idSpaceManager1?: number;
  quantityCarton?: number;
  typeVoucher?: number;
  type?: string;
  createdAt?: Date;
  updateAt?: Date;
  status?: Status;
}

