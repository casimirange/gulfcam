import {IUser} from "./user";
import {Status} from "./status";
import {StatusTransaction} from "./statusTransaction";
import {Seance} from "./seance";

export class Amande{
  id?: number;
  montant: number;
  motif: string;
  idSeance: number;
  seance?: Seance;
  typeTransaction?: StatusTransaction;
  transaction?: string;
  idUser: number;
  user?: IUser;
  createdAt: Date
  date: Date
  updatedAt: Date
}

