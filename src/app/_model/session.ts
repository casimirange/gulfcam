import {Status} from "./status";

export class Session {
  id?: number;
  mangwa: number;
  name?: string;
  beginDate: Date;
  endDate: Date;
  tax: number;
  creator?: string;
  status?: Status;
  createdAt?: Date
  updatedAt?: Date
}

