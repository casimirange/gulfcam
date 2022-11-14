// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const url = 'http://localhost:8080/api/v1.0/';
export const environment = {
  production: false,
  signin: url + 'auth/sign-in',
  signup: url + 'auth/sign-up',
  verification: url + 'auth/verify',
  sendOtp: url + 'auth/resetOtpCode',
  client: url + 'client',
  typeVoucher: url + 'typevoucher',
  store: url + 'store',
  product: url + 'product',
  order: url + 'order',
  storeHouse: url + 'storehouse',
  users: url + 'users',
  paymentMethod: url + 'paymentmethode',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.