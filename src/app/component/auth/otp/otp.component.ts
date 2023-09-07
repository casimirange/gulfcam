import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../../_services/auth.service";
import {TokenService} from "../../../_services/token/token.service";
import {NotifsService} from "../../../_services/notifications/notifs.service";
import {Router} from "@angular/router";
import {BnNgIdleService} from "bn-ng-idle";
<<<<<<< HEAD
import {BehaviorSubject} from "rxjs";
=======
import {aesUtil, key} from "../../../_helpers/aes.js";
import {ISignup} from "../../../_model/signup";
import {BehaviorSubject, Subscription} from "rxjs";
>>>>>>> 37d14d372724acd031f893c0236343c371360e75

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent implements OnInit, OnDestroy{

  otp!: string;
  inputDigitLeft: string = "Entrer le code";
  btnStatus: string = "btn-light";
  timer: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  user: ISignup = new ISignup()
  sendNewVerifyCode: boolean = false;
<<<<<<< HEAD
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  userEmail: string = localStorage.getItem('email').toString()
=======
  userEmail: string = aesUtil.decrypt(key, localStorage.getItem('email').toString()).toString()
>>>>>>> 37d14d372724acd031f893c0236343c371360e75
  newOtp = {
    appProvider: '',
    email: ''
  }

  firstName: string | null = '';
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  public configOptions = {
    length: 5,
    inputClass: 'digit-otp',
    containerClass: 'd-flex justify-content-between'
  }

  private mySubscription: Subscription
  constructor(private authService: AuthService, private token: TokenService, private notifService: NotifsService,
              private router: Router) {
  }

  ngOnInit() {
    this.setTimer()
  }

  setTimer(){
    //on fait un décompte de 5 minutes pour entrer le code otp
    const date = Date.parse(localStorage.getItem('exp').toString())
    const date1 = new Date()
    this.timer = (date - date1.getTime())/1000
    setInterval(() => {
      if(this.timer > 0) {
        this.timer--;
        this.minutes = parseInt(((this.timer % 3600) / 60).toString());
        this.seconds = this.timer % 60;
      } else {
        this.sendNewVerifyCode = true
        this.inputDigitLeft = "Reconnexion";
        this.btnStatus = 'btn-danger';
      }
    },1000)
  }

  onOtpChange(event: any) {
    this.otp = event;
    if(this.otp.length < this.configOptions.length) {
      this.inputDigitLeft = this.configOptions.length - this.otp.length + `${(this.configOptions.length - this.otp.length) > 1 ? " caractères restants" : ' caractère restant'}`;
      this.btnStatus = 'btn-light';
    }

    if(this.otp.length == this.configOptions.length) {
      this.inputDigitLeft = "Vérifier le code";
      this.btnStatus = 'btn-primary';
    }
  }

  verifyOtp(){
    this.isLoading.next(true);
    this.inputDigitLeft = 'Vérification ...'
<<<<<<< HEAD
      this.authService.verifyOtp(this.otp).subscribe(
        (resp) => {
          this.isLoading.next(false);
          this.token.saveRefreshToken(resp.refreshToken);
          this.token.saveAuthorities(resp.roles)
          this.token.saveUserInfo(resp.user)
          this.firstName = localStorage.getItem('firstName')
          this.notifService.onSuccess(`Bienvenue ${this.firstName}`)
=======
      // this.authService.verifyOtp(aesUtil.encrypt(key,this.otp)).subscribe(
      this.mySubscription = this.authService.verifyOtp(this.otp).subscribe(
        (response) => {
          this.isLoading.next(false);

          this.token.saveRefreshToken(JSON.parse(aesUtil.decrypt(key,response.key.toString())).refreshToken);
          // console.log('roles ', JSON.parse(aesUtil.decrypt(key,response.key.toString())).roles)
          // console.log('resp ', JSON.parse(aesUtil.decrypt(key,response.key.toString())))
          const tab = JSON.parse(aesUtil.decrypt(key,response.key.toString())).roles
          const tab2 = []
          // console.log(tab)
          tab.forEach(w => tab2.push(aesUtil.encrypt(key, w)))
          // console.log(tab2)
          // console.log('roles décrypté', aesUtil.decrypt(key, resp.roles))
          this.token.saveAuthorities(tab2)
          this.user.iStore =  JSON.parse(aesUtil.decrypt(key,response.key.toString())).idStore
          this.user.firstName =  JSON.parse(aesUtil.decrypt(key,response.key.toString())).firstname
          this.user.lastName =  JSON.parse(aesUtil.decrypt(key,response.key.toString())).lastname
          this.user.internalReference =  JSON.parse(aesUtil.decrypt(key,response.key.toString())).uid
          this.user.userId =  JSON.parse(aesUtil.decrypt(key,response.key.toString())).id
          // console.log('user', this.user)

          this.token.saveUserInfo(this.user)
          this.token.saveUserAccount(JSON.parse(aesUtil.decrypt(key,response.key.toString())).account)
          this.firstName = JSON.parse(aesUtil.decrypt(key,response.key.toString())).firstname
          this.notifService.onSuccess(`Bienvenue ${this.firstName}`)
          // this.bnIdle.stopTimer()
          // this.bnIdle.resetTimer()
>>>>>>> 37d14d372724acd031f893c0236343c371360e75

        }, (error) => {
          this.isLoading.next(false);
          // this.inputDigitLeft = "Reéssayer";
          // this.btnStatus = 'btn-danger';
          this.isLoading.next(false);
          this.token.clearTokenExpired()
        }
      )
  }

  reconnect(){
    this.token.clearTokenExpired();
    // this.newOtp.appProvider = '';
    // this.newOtp.email = localStorage.getItem('email').toString();
    // this.authService.newOtpCode(this.newOtp).subscribe(
    //   (resp) => {
    //     // this.token.saveRefreshToken(resp.refreshToken);
    //     // this.token.saveAuthorities(resp.roles)
    //     // this.token.saveUserInfo(resp.user)
    //     // console.log(resp)
    //     this.sendNewVerifyCode = false;
    //     this.setTimer()
    //     this.token.saveToken(resp);
    //     this.notifService.onSuccess(`Nouveau code envoyé`)
    //     //
    //   }, (error) => {
    //     console.log('error', error)
    //     this.inputDigitLeft = "Vérifier";
    //     this.btnStatus = 'btn-danger';
    //     // this.notifService.onError(error.error.message, 'échec de connexion')
    //   }
    // )
  }

  ngOnDestroy(): void {
    this.mySubscription ? this.mySubscription.unsubscribe() : null
  }

}
