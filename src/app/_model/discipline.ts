import {IUser} from "./user";
import {Session} from "./session";
import {StatusTransaction} from "./statusTransaction";
import {Seance} from "./seance";

export interface Discipline{
    id?:	number
    sanction:	string
    typeDiscipline?: StatusTransaction
    user:	IUser
    seance:	Seance
    date:	Date
    createdAt?:	string
    updatedAt?:	string
  }

