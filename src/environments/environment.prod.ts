// const url = 'https://api.dev.gulfcamsas.com/api/v1.0/'
const url = 'http://54.229.221.79:8080/adelispringboot-0.0.1-SNAPSHOT/api/v1.0/'
export const environment = {
  production: true,
  signin: url + 'auth/sign-in',
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
