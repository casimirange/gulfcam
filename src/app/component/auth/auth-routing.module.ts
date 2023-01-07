import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {SignupComponent} from "./signup/signup.component";
import {OtpComponent} from "./otp/otp.component";
import {AuthGuard} from "../../_helpers/auth.guard";
import {ForgetPasswordComponent} from "./forget-password/forget-password.component";
import {ResetPasswordComponent} from "./reset-password/reset-password.component";

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch:'full' },
  { path: 'login', component: LoginComponent },
  { path: 'forget-password', component: ForgetPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'otp', component: OtpComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
