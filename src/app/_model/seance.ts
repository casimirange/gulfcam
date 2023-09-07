import {IUser} from "./user";
import {Session} from "./session";
import {TypeAccount} from "./signup";

export class Seance{
    id?:	number
    date?: Date
    linkCompteRendu?: string
    users?:	IUser
    session?:	Session
    createdAt?:	string
    updatedAt?:	string
    status: TypeAccount
  }

