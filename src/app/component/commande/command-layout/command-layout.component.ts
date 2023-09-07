import { Component, OnInit } from '@angular/core';
import {ConfigOptions} from "../../../configOptions/config-options";

@Component({
  selector: 'app-command-layout',
  templateUrl: './command-layout.component.html',
  styleUrls: ['./command-layout.component.css']
})
export class CommandLayoutComponent implements OnInit {
  user: any;

  constructor(public globals: ConfigOptions) { }

  ngOnInit(): void {

  }

}
