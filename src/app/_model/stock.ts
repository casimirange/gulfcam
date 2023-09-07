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
  idStoreHouseStockage: string;
  idStoreHouseStockage2?: number;
  // listCartons: string[];
  listCartons: string;
  idStoreHouse1?: number;
  idStoreHouse2?: number;
  storeHouse1?: StoreHouse;
  storeHouse2?: StoreHouse;
  idStoreKeeper?: number;
  idSpaceManager1?: string;
  quantityCarton?: number;
  typeVoucher?: number;
  type?: string;
  createdAt?: Date;
  updateAt?: Date;
  status?: Status;
}

