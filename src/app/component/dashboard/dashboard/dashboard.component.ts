import { Component, OnInit } from '@angular/core';
import {log} from "util";
import {aesUtil, key} from "../../../_helpers/aes";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  roleUser = aesUtil.decrypt(key, localStorage.getItem('userAccount').toString())
  role: string[] = []
  constructor() { }

  ngOnInit(): void {
    JSON.parse(localStorage.getItem('Roles').toString()).forEach(authority => {
      this.role.push(aesUtil.decrypt(key,authority));
    });
  }

}
