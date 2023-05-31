import { Component, OnInit } from '@angular/core';
import {Unite} from "../../../_model/unite";
import {UnitsService} from "../../../_services/units/units.service";
import {ActivatedRoute} from "@angular/router";
import {StoreService} from "../../../_services/store/store.service";
import {aesUtil, key} from "../../../_helpers/aes.js";

@Component({
  selector: 'app-unites',
  templateUrl: './unites.component.html',
  styleUrls: ['./unites.component.css']
})
export class UnitesComponent implements OnInit {
  units: Unite[] = [];
  unit: Unite = new Unite();
  constructor(private unitService: UnitsService, private activatedRoute: ActivatedRoute, private storeService: StoreService,) { }

  ngOnInit(): void {
    this.getUnitByStore()
  }

  getUnitByStore(){
    this.activatedRoute.params.subscribe(params => {
      this.storeService.getUnitByStore(params['id'] as number).subscribe(
        resp => {
          console.log(JSON.parse(aesUtil.decrypt(key, resp.key.toString())))
          this.units = JSON.parse(aesUtil.decrypt(key,resp.key.toString()));
        }
      )
    })
  }

  formatNumber(amount: number): string{
    return amount.toFixed(0).replace(/(\d)(?=(\d{3})+\b)/g,'$1 ');
  }
}
