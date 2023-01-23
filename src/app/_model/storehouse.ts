import {Store} from "./store";
import {Status} from "./status";

export class StoreHouse{
  id?: number;
  internalReference?: number;
  idStore: number;
  type: string;
  name: string;
  localisationStore: string;
  createAt?: Date;
  updateAt?: Date;
  status?: Status;
  store?: Store
}
