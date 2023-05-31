import {Client} from "./client";
import {Status} from "./status";
import {Store} from "./store";
import {PaiementMethod} from "./paiement";

export class Order{
    id?:	number
    internalReference?: number
    clientReference?:	number
    idClient?:	number
    client?:	Client
    idFund?:	string
    idManagerStore?:	number
    idManagerCoupon?:	number
    idManagerOrder?:	number
    idCommercialAttache?:	any
    idSalesManager?:	string
    idSpaceManager2?:	number
    idSpaceManager1?:	number
    idStorekeeper?:	number
    linkInvoice?: string
    linkDelivery?: string
    tax?:	number
    idStore?: any
    store?: Store
    status?:	Status
    channel?:	string
    deliveryTime?:	string
    paymentReference?:	string
    reasonForCancellation?:	string
    description?:	string
    createdAt?:	string
    updateAt?:	string
    idPaymentMethod?:	string
    paymentMethod?:	PaiementMethod
    netAggregateAmount?:	number
    ttcaggregateAmount?:	number
    localisation?:	string
    completeName?:	string
    products?:	any[]
  }

