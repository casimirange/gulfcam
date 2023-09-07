import {Status} from "./status";

export class ICredentialsSignup{
  email?: string;
  telephone?: string;
  montant?: number;
  idStore?: number;
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
  email: string;
  username: string;
  telephone: string;
  montant: number;
  lastName: string;
  firstName: string;
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
