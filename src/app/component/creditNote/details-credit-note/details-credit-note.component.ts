import {Component, OnDestroy, OnInit} from '@angular/core';
import {RequestOpposition} from "../../../_model/requestOpposition";
import {Ticket} from "../../../_model/ticket";
import {BehaviorSubject, Observable, of, Subscription} from "rxjs";
import {OppositionService} from "../../../_services/opposition/opposition.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TicketService} from "../../../_services/ticket/ticket.service";
import {NotifsService} from "../../../_services/notifications/notifs.service";
import {StatusService} from "../../../_services/status/status.service";
import {Location} from "@angular/common";
import {CreditNote} from "../../../_model/creditNote";
import {CreditNoteService} from "../../../_services/creditNote/credit-note.service";
import {Coupon} from "../../../_model/coupon";
import {aesUtil, key} from "../../../_helpers/aes.js";
import {AppState} from "../../../_interfaces/app-state";
import {ISignup} from "../../../_model/signup";
import {DataState} from "../../../_enum/data.state.enum";
import {catchError, map, startWith} from "rxjs/operators";

@Component({
  selector: 'app-details-credit-note',
  templateUrl: './details-credit-note.component.html',
  styleUrls: ['./details-credit-note.component.css']
})
export class DetailsCreditNoteComponent implements OnInit, OnDestroy {

  creditNote: CreditNote = new CreditNote();
  roleUser = aesUtil.decrypt(key, localStorage.getItem('userAccount').toString())
  role: string[] = []
  appState$: Observable<AppState<CreditNote>>;
  readonly DataState = DataState;
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  private isExporting = new BehaviorSubject<boolean>(false);
  isExtracting$ = this.isExporting.asObservable();
  statut: string;
  coupons: Coupon[] = []
  private mySubscription: Subscription;
  private mySubscription2: Subscription;
  idmanager = aesUtil.decrypt(key, localStorage.getItem('uid').toString())
  constructor(private noteService: CreditNoteService, private activatedRoute: ActivatedRoute, private router: Router,
              private statusService: StatusService, private _location: Location, private notifService: NotifsService) {
    JSON.parse(localStorage.getItem('Roles').toString()).forEach(authority => {
      this.role.push(aesUtil.decrypt(key, authority));
    });
  }

  ngOnInit(): void {
    this.getCreditNoteInfos()
  }

  getCreditNoteInfos() {
    this.activatedRoute.params.subscribe(params => {
      this.appState$ = this.noteService.getCreditNoteByInternalRef$(params['id'].toString())
        .pipe(
          map(response => {
            return {dataState: DataState.LOADED_STATE, appData: JSON.parse(aesUtil.decrypt(key,response.key.toString()))}
          }),
          startWith({dataState: DataState.LOADING_STATE, appData: null}),
          catchError((error: string) => {
            return of({dataState: DataState.ERROR_STATE, error: error})
          })
        )

      // this.noteService.getCreditNoteByInternalRef(params['id'].toString()).subscribe(
      //   res => {
      //     this.creditNote = JSON.parse(aesUtil.decrypt(key, res.key.toString()));
      //     this.statut = this.creditNote.status.name
      //     this.coupons = this.creditNote.coupon
      //   }
      // )
    })
  }

  back() {
    this._location.back()
  }

  validCreditNote() {
    this.activatedRoute.params.subscribe(params => {
      this.isLoading.next(true);
      this.mySubscription = this.noteService.validCreditNote(params['id'] as number).subscribe(
        resp => {
          this.isLoading.next(false);
          this.getCreditNoteInfos()
          this.notifService.onSuccess("note de crédit validée")
        },
        error => {
          this.isLoading.next(false);
        }
      )
    })
  }

  getStatuts(status: string): string {
    return this.statusService.allStatus(status)
  }

  padWithZero(num, targetLength) {
    return String(num).padStart(targetLength, '0');
  }

  exportCreditNote() {
    this.activatedRoute.params.subscribe(params => {
      this.isExporting.next(true)
      this.mySubscription2 = this.noteService.exportCreditNote(params['id'] as number).subscribe(
        resp => {
          this.isExporting.next(false)
          const file = new Blob([resp], {type: 'application/pdf'});
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        }, error => {
          this.isExporting.next(false)
        }
      )
    })
  }

  ngOnDestroy(): void {
    this.mySubscription ? this.mySubscription.unsubscribe() : null;
    this.mySubscription2 ? this.mySubscription2.unsubscribe() : null;
  }

}
