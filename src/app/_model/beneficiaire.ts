import {IUser} from "./user";
import {Status} from "./status";
import {StatusTransaction} from "./statusTransaction";
import {Seance} from "./seance";

export class Beneficiaire{
  id?: number;
  idSeance?: number;
  idUser?: number;
  montant: number;
  user?: IUser;
  seance?: Seance;
  createdAt?: Date;
  updatedAt?: Date;
}

