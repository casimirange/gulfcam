import {Status} from "./status";

export class ICredentialsSignup{
  email?: string;
  telephone?: string;
<<<<<<< HEAD
  montant?: number;
  idStore?: number;
=======
  pinCode?: string;
  idStore?: string;
>>>>>>> 37d14d372724acd031f893c0236343c371360e75
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
<<<<<<< HEAD
=======
  position: string;
  account: string;
  idStore?: number;
  iStore?: string;
>>>>>>> 37d14d372724acd031f893c0236343c371360e75
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
