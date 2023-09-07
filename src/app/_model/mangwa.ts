import {IUser} from "./user";
import {Status} from "./status";
import {StatusTransaction} from "./statusTransaction";

export class Mangwa{
  id?: number;
  montant: number;
  date: Date;
  motif: string;
  typeTransaction?: StatusTransaction;
  transaction?: string;
  user: IUser;
}

