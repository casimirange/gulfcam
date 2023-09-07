import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BehaviorSubject, Observable, of} from "rxjs";
import {AppState} from "../../../_interfaces/app-state";
import {CustomResponse} from "../../../_interfaces/custom-response";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NotifsService} from "../../../_services/notifications/notifs.service";
import {catchError, map, startWith} from "rxjs/operators";
import {DataState} from "../../../_enum/data.state.enum";
import {Seance} from "../../../_model/seance";
import {SeanceService} from "../../../_services/seance/seance.service";
import {UsersService} from "../../../_services/users/users.service";
import {IUser} from "../../../_model/user";
import {LoaderComponent} from "../../../preloader/loader/loader.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-index-seance',
  templateUrl: './index-seance.component.html',
  styleUrls: ['./index-seance.component.css']
})
export class IndexSeanceComponent implements OnInit {

  title = 'Enregistrer nouvelle séance';
  users: IUser[] = [];
  seances: Seance[] = []
  seance: Seance = new Seance();
  selectedSeance: Seance = new Seance();
  seanceForm: FormGroup;
  crForm: FormGroup;

  page: number = 1;
  totalPages: number;
  totalElements: number;
  size: number = 3;
  seanceState$: Observable<AppState<CustomResponse<Seance>>>;
  readonly dataState = DataState;
  private dataSubjects = new BehaviorSubject<CustomResponse<Seance>>(null);
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  roleUser = localStorage.getItem('userAccount').toString()
  selectedFiles: FileList;
  currentFileUpload: File;
  constructor(private fb: FormBuilder, private modalService: NgbModal, private userService: UsersService,private router: Router,
              private notifsService: NotifsService, private seanceService: SeanceService
  ) {
    this.formOrder();
    this.formCr();
  }

  //initialisation de création du formulaire de commande
  formOrder() {
    this.seanceForm = this.fb.group({
      user: ['', [Validators.required,]],
      date: ['', [Validators.required,]],
    });
  }

  formCr(){
    this.crForm = this.fb.group({
      file: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    this.getUsers()
    this.getSeances()
  }

  getUsers(): void {
    this.userService.getUsers().subscribe(
      resp => {
        // console.table(resp.content)
        this.users = resp.content;
      }
    )
  }

  getSeances() {
    this.seanceState$ = this.seanceService.seances$(this.page - 1, this.size)
      .pipe(
        map(response => {
          this.dataSubjects.next(response)
          // console.log(response)
          this.notifsService.onSuccess('Chargement des séances')
          return {dataState: DataState.LOADED_STATE, appData: response}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }


  annuler() {
    this.formOrder();
    this.modalService.dismissAll()
  }

  saveSeance() {
    this.isLoading.next(true);

    this.seance.date = this.seanceForm.controls['date'].value
    this.seance.users = this.seanceForm.controls['user'].value

    this.seanceState$ = this.seanceService.addSeance$(this.seance)
      .pipe(
        map((response) => {
          this.dataSubjects.next(
            {...this.dataSubjects.value, content: [response, ...this.dataSubjects.value.content]}
          )
          this.isLoading.next(false)
          this.annuler()
          this.getSeances()
          return {dataState: DataState.LOADED_STATE, appData: this.dataSubjects.value}
        }),
        startWith({dataState: DataState.LOADED_STATE, appData: this.dataSubjects.value}),
        catchError((error: string) => {
          this.isLoading.next(false)
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )

  }

  saveCompteRendu() {
    this.isLoading.next(true);
    this.currentFileUpload = this.selectedFiles.item(0);

    this.seanceService.saveCompteRenduSeance(this.selectedSeance.id, this.currentFileUpload).subscribe(
      resp => {
        this.isLoading.next(false);
        this.notifsService.onSuccess('Compte rendu enregistré')
        this.getSeances()
        this.generateCompteRendu(this.selectedSeance);
        this.crForm.controls['file'].reset()
        this.annuler()
      }, error => {
        this.isLoading.next(false)
      }
    )

  }

  generateCompteRendu(seance: Seance){
    const docType = 'pdf'
    const type = 'DELIVERY'
    this.openLoader()
    this.seanceService.getComteRendu(seance.id, type, docType).subscribe(
      respProd => {
        this.closeLoader()
        const file = new Blob([respProd], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      },error => {
        this.closeLoader()
      }

    )
  }

  openLoader(){
    this.modalService.open(LoaderComponent, {backdrop: false });
  }

  closeLoader(){
    this.modalService.dismissAll()
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  openSeanceModal(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-titles', size: 'xl',});
  }

  openCompteRenduModal(content: any, seance: Seance) {
    this.selectedSeance = seance;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-titles', size: 'xl',});
  }

  pageChange(event: number) {
    this.page = event
    this.seanceState$ = this.seanceService.seances$(this.page - 1, this.size)
      .pipe(
        map(response => {
          this.dataSubjects.next(response)
          this.notifsService.onSuccess('Chargement des séances')
          return {dataState: DataState.LOADED_STATE, appData: response}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }

  seanceDetails(seance: Seance) {
    this.router.navigate(['/seance/details', seance.id])
  }
}
