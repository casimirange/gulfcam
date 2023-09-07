import {Component, HostListener, OnInit} from '@angular/core';
import {ConfigOptions} from "../../../configOptions/config-options";
import {Observable} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {aesUtil, key} from "../../../_helpers/aes.js";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  roleUser = aesUtil.decrypt(key,localStorage.getItem('userAccount').toString())
  public extraParameter: any;
  role: string[] = []

  constructor(public globals: ConfigOptions, private activatedRoute: ActivatedRoute) {

  }

  private newInnerWidth: number;
  private innerWidth: number;

  toggleSidebar() {
    this.globals.toggleSidebar = !this.globals.toggleSidebar;
  }

  sidebarHover() {
    this.globals.sidebarHover = !this.globals.sidebarHover;
  }

  ngOnInit() {
    setTimeout(() => {
      this.innerWidth = window.innerWidth;
      if (this.innerWidth < 1200) {
        this.globals.toggleSidebar = true;
      }
    });

<<<<<<< HEAD
    // console.log(this.globals.toggleSidebar)
=======
    JSON.parse(localStorage.getItem('Roles').toString()).forEach(authority => {
      this.role.push(aesUtil.decrypt(key,authority));
    });
>>>>>>> 37d14d372724acd031f893c0236343c371360e75

    // this.extraParameter = this.activatedRoute.snapshot.firstChild.data.extraParameter;

  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.newInnerWidth = event.target.innerWidth;

    if (this.newInnerWidth < 1200) {
      this.globals.toggleSidebar = true;
    } else {
      this.globals.toggleSidebar = false;
    }

  }

}
