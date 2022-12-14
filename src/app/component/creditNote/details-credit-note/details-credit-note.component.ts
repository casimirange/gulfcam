import { Component, OnInit } from '@angular/core';
import {RequestOpposition} from "../../../_model/requestOpposition";
import {Ticket} from "../../../_model/ticket";
import {BehaviorSubject} from "rxjs";
import {OppositionService} from "../../../_services/opposition/opposition.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TicketService} from "../../../_services/ticket/ticket.service";
import {NotifsService} from "../../../_services/notifications/notifs.service";
import {StatusService} from "../../../_services/status/status.service";
import {Location} from "@angular/common";
import {CreditNote} from "../../../_model/creditNote";
import {CreditNoteService} from "../../../_services/creditNote/credit-note.service";
import {Coupon} from "../../../_model/coupon";

@Component({
  selector: 'app-details-credit-note',
  templateUrl: './details-credit-note.component.html',
  styleUrls: ['./details-credit-note.component.css']
})
export class DetailsCreditNoteComponent implements OnInit {

  creditNote: CreditNote = new CreditNote();
  roleUser = localStorage.getItem('userAccount').toString()
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  statut: string;
  coupons: Coupon[] = []

  constructor(private noteService: CreditNoteService, private activatedRoute: ActivatedRoute, private router: Router,
              private statusService: StatusService, private _location: Location, private notifService: NotifsService) {
  }

  ngOnInit(): void {
    this.getCreditNoteInfos()
  }

  private getCreditNoteInfos() {
    this.activatedRoute.params.subscribe(params => {
      this.noteService.getCreditNoteByInternqlRef(params['id']).subscribe(
        res => {
          this.creditNote = res;
          console.log(res)
          this.statut = this.creditNote.status.name
          this.coupons = this.creditNote.coupon

        }
      )
    })
  }

  back() {
    this._location.back()
  }

  validCreditNote() {
    this.isLoading.next(true);
    this.noteService.validCreditNote(this.creditNote.internalReference).subscribe(
      resp => {
        this.isLoading.next(false);
        this.getCreditNoteInfos()
        this.notifService.onSuccess("note de cr??dit valid??e")
      },
      error => {
        this.isLoading.next(false);
      }
    )
  }

  getStatuts(status: string): string {
    return this.statusService.allStatus(status)
  }

  padWithZero(num, targetLength) {
    return String(num).padStart(targetLength, '0');
  }
}
