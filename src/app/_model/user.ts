import {Status} from "./status";

export interface IUser{
  id?: string;
  userId?: string;
  name?: string;
  firstname?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  password?: string;
  pinCode?: number;
  internalReference?: number;
  email?: string;
  function?: string;
  phone?: number;
  roles?: string[];
  magasin?: string;
  crreatedAt?: Date;
  updatedAt?: Date;
  status?: Status;
  access_token?: string;
}
