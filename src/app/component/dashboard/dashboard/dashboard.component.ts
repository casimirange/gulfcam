import { Component, OnInit } from '@angular/core';
import {log} from "util";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  roleUser = localStorage.getItem('userAccount').toString()
  role: string[] = []
  constructor() { }

  ngOnInit(): void {
    JSON.parse(localStorage.getItem('Roles')).forEach(authority => {
      this.role.push(authority);
    });
  }

}
