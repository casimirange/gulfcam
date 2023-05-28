import { Component, OnInit } from '@angular/core';
import {log} from "util";
import {aesUtil, key} from "../../../_helpers/aes.js";

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

    // const tab = ["voyou"]
    // const tab2 = []
    // console.log(tab)
    // tab.forEach(w => tab2.push(aesUtil.encrypt(key, w)))
    // console.log(tab2)
    // console.log(JSON.stringify(tab))
    // console.log(JSON.stringify(aesUtil.encrypt(key, tab.toString())))
    // tab2.push(JSON.stringify(aesUtil.encrypt(key, tab.toString())))
    // console.log(JSON.stringify(tab2))
    // console.log(aesUtil.decrypt(key, "fcf8a88e83183da659212c4f4c39ed9e8ad660f05cd4d2ac64bb991d6ace0b9e44e154ca925755cba3299f6012d7e2d4n3q3s3+zr3xPighxOqGOlw=="))


    JSON.parse(localStorage.getItem('Roles').toString()).forEach(authority => {
      this.role.push(aesUtil.decrypt(key,authority));
    });
    // console.log(this.role)
  }

}
