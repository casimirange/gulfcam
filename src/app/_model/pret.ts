import {IUser} from "./user";
import {Status} from "./status";
import {StatusTransaction} from "./statusTransaction";
import {Seance} from "./seance";
import {StatusPret} from "./statusPret";

export interface Pret{
  idPret?: number;
  idSeance?: number;
  idUser?: number;
  montant_prete?: number;
  montant_rembourse?: number;
  total?: boolean;
  dateRemboursement?: Date;
  typeTransaction?: StatusTransaction;
  statutPret?: StatusPret;
  user?: IUser;
  seance?: Seance;
  createdAt?: Date;
  date?: Date;
  updatedAt?: Date;
}

