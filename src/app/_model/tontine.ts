import {IUser} from "./user";
import {Session} from "./session";
import {StatusTransaction} from "./statusTransaction";

export class Tontine{
    idTontine?:	number
    montant:	number
    description:	string
    typeTransaction: StatusTransaction
    user:	IUser
    createdAt?:	string
    updatedAt?:	string
  }

