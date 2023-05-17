import {Status} from "./status";

export class ICredentialsSignup{
  email?: string;
  telephone?: string;
  pinCode?: string;
  idStore?: string;
  // username?: string,
  password?: string;
  firstName?: string;
  lastName?: string;
  position?: string;
  typeAccount?: string;
  roleName?: string;
}

export class ISignup{
  userId: number;
  internalReference: number;
  pinCode: number;
  email: string;
  username: string;
  nameStore: string;
  telephone: string;
  lastName: string;
  firstName: string;
  position: string;
  account: string;
  idStore?: number;
  iStore?: string;
  typeAccount: TypeAccount;
  roles: IRole[];
  status: Status;
}

export class IRole{
  name: string;
  description: string;
  id: number
}

export class TypeAccount{
  name: string;
  id: number
}
