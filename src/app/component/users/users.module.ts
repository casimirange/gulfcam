import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UserLayoutComponent } from './user-layout/user-layout.component';
import { IndexUsersComponent } from './index-users/index-users.component';
import {SharedModule} from "../shared/shared.module";
import { DetailsUserComponent } from './details-user/details-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { AddUserComponent } from './add-user/add-user.component';
import {NgxPaginationModule} from "ngx-pagination";


@NgModule({
  declarations: [
    UserLayoutComponent,
    IndexUsersComponent,
    DetailsUserComponent,
    EditUserComponent,
    AddUserComponent
  ],
    imports: [
        CommonModule,
        UsersRoutingModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        NgxPaginationModule
    ]
})
export class UsersModule { }
