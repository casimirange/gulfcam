import {Status} from "./status";

export class Client {
  id?: number;
  internalReference?: number;
  completeName: string;
  companyName: string;
  address: string;
  phone: string;
  email: string;
  gulfcamAccountNumber: string;
  rccm: string;
  niu: string;
  typeClient: TypeClient;
  createdAt?: Date
  updateAt?: Date
  status: Status
}

export class TypeClient{
  id?: string;
  name: string
}
