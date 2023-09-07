// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const url = 'http://localhost:8081/api/v1.0/';
export const environment = {
  production: false,
  signin: url + 'auth/sign-in',
  refresh: url + 'auth/refresh',
  signup: url + 'auth/sign-up',
  resetPassword: url + 'auth/reset-password',
  verification: url + 'auth/verify',
  changePassword: url + 'auth/user',
  sendOtp: url + 'auth/resetOtpCode',
<<<<<<< HEAD
=======
  changePassword: url + 'auth/user',
  client: url + 'client',
  typeVoucher: url + 'typevoucher',
  store: url + 'store',
  product: url + 'product',
  order: url + 'order',
  storeHouse: url + 'storehouse',
>>>>>>> 37d14d372724acd031f893c0236343c371360e75
  users: url + 'users',
  session: url + 'session',
  seance: url + 'seance',
  mangwa: url + 'mangwa',
  tontine: url + 'tontine',
  discipline: url + 'discipline',
  amande: url + 'amandes',
  pret: url + 'pret',
  beneficiaire: url + 'beneficiaire',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
