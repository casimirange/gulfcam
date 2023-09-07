import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BehaviorSubject, Observable, of} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ActivatedRoute, Router} from "@angular/router";
import {NotifsService} from "../../../_services/notifications/notifs.service";
import Swal from "sweetalert2";
import {SeanceService} from "../../../_services/seance/seance.service";
import {AppState} from "../../../_interfaces/app-state";
import {CustomResponse} from "../../../_interfaces/custom-response";
import {catchError, map, startWith} from "rxjs/operators";
import {DataState} from "../../../_enum/data.state.enum";
import {Seance} from "../../../_model/seance";
import {Tontine} from "../../../_model/tontine";
import {Discipline} from "../../../_model/discipline";
import {UsersService} from "../../../_services/users/users.service";
import {IUser} from "../../../_model/user";
import {Amande} from "../../../_model/amande";
import {Pret} from "../../../_model/pret";
import {PretsService} from "../../../_services/pret/prets.service";
import {TontineService} from "../../../_services/tontine/tontine.service";
import {MangwaService} from "../../../_services/mangwa/mangwa.service";
import {Beneficiaire} from "../../../_model/beneficiaire";
import {LoaderComponent} from "../../../preloader/loader/loader.component";
import {Location} from "@angular/common";

@Component({
  selector: 'app-detail-seance',
  templateUrl: './detail-seance.component.html',
  styleUrls: ['./detail-seance.component.css']
})
export class DetailSeanceComponent implements OnInit, OnDestroy {

  roleUser = localStorage.getItem('userAccount').toString()
  appState$: Observable<AppState<Seance>>;
  cotisation$: Observable<AppState<CustomResponse<Tontine>>>;
  amande$: Observable<AppState<CustomResponse<Amande>>>;
  benef$: Observable<AppState<CustomResponse<Beneficiaire>>>;
  discipline$: Observable<AppState<CustomResponse<Discipline>>>;
  pret$: Observable<AppState<CustomResponse<Pret>>>;
  statutSeance: string | undefined
  readonly DataState = DataState;
  private dataSubjects = new BehaviorSubject<Seance>(null);
  private dataSubjectsSeanceCotisation = new BehaviorSubject<CustomResponse<Tontine>>(null);
  private dataSubjectsSeanceDiscipline = new BehaviorSubject<CustomResponse<Discipline>>(null);
  private dataSubjectsSeanceAmande = new BehaviorSubject<CustomResponse<Amande>>(null);
  private dataSubjectsSeancePret = new BehaviorSubject<CustomResponse<Pret>>(null);
  private dataSubjectsSeanceBenef = new BehaviorSubject<CustomResponse<Beneficiaire>>(null);
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  private isCotise = new BehaviorSubject<boolean>(false);
  isCotise$ = this.isCotise.asObservable();
  private IdParam: string;
  page: number = 1;
  totalPages: number;
  totalElements: number;
  size: number = 10;
  amandeForm: FormGroup;
  pretForm: FormGroup;
  disciplineForm: FormGroup;
  benefForm: FormGroup;
  users: CustomResponse<IUser>;
  amande: Amande = new Amande();
  pret: Pret ;
  beneficiaire: Beneficiaire = new Beneficiaire();
  discipline: Discipline ;
  soldeState$: Observable<AppState<number>>;
  soldeTontine$: Observable<AppState<number>>;
  sm: number | undefined;
  st: number | undefined;
  private loadingFile = new BehaviorSubject<boolean>(false);
  constructor(private activatedRoute: ActivatedRoute, private route: ActivatedRoute, private modalService: NgbModal,
              private notifService: NotifsService, private fb: FormBuilder, private _location: Location,
              private userService: UsersService, private pretService: PretsService, private tontineService: TontineService, private mangwaService: MangwaService,
              private seanceService: SeanceService) {
    this.IdParam = this.route.snapshot.paramMap.get('id');
    this.formAmande()
    this.formPret()
    this.formBenef()
    this.formDiscipline()
  }

  ngOnInit(): void {
    this.getSeanceInfos()
    this.getCotisationBySeance()
    this.getDisciplineBySeance()
    this.getBeneficiaireBySeance()
    this.getPretBySeance()
    this.getAmandeBySeance()
    this.getUsers()
    this.getSoldeMangwas()
    this.getSoldeTontine()
  }

  getUsers(){
    this.userService.getUserss().subscribe(
      resp => {
        this.users = resp
      }
    )
  }

  getSoldeMangwas(){
    this.soldeState$ = this.mangwaService.soldeMangwa$()
      .pipe(
        map(response => {
          this.sm = response
          return {dataState: DataState.LOADED_STATE, appData: response}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }

  getSoldeTontine(){
    this.soldeTontine$= this.tontineService.soldeTontine$()
      .pipe(
        map(response => {
          this.st = response
          return {dataState: DataState.LOADED_STATE, appData: response}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }

  formAmande(){
    this.amandeForm = this.fb.group({
      pay: ['', ],
      montant: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(1)]],
      motif: ['', [Validators.required, Validators.minLength(4)]],
      idUser: ['', [Validators.required]]
    });
  }

  formPret(){
    this.pretForm = this.fb.group({
      montant: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(1)]],
      idUser: ['', [Validators.required]]
    });
  }

  formBenef(){
    this.benefForm = this.fb.group({
      montant: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(1)]],
      idUser: ['', [Validators.required]]
    });
  }

  formDiscipline(){
    this.disciplineForm = this.fb.group({
      sanction: ['', [Validators.required, Validators.minLength(4)]],
      idUser: ['', [Validators.required]]
    });
  }

  getSeanceInfos(){
    this.appState$ = this.seanceService.showSeance$(parseInt(this.IdParam))
      .pipe(
        map(response => {
          // console.log(response)
          this.dataSubjects.next(response)
          this.statutSeance = response.status.name;
          return {dataState: DataState.LOADED_STATE, appData: response}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )

    // this.activatedRoute.params.subscribe(params => {
    //   this.clientService.findClient(params['id']).subscribe(
    //     res => {
    //       this.client = res;
    //       console.log(res)
    //     }
    //   )
    // })
  }

  getCotisationBySeance(){
    this.cotisation$ = this.seanceService.showCotisationBySeance$(+this.IdParam, this.page - 1, this.size)
      .pipe(
        map(response => {
          this.dataSubjectsSeanceCotisation.next(response)
          return {dataState: DataState.LOADED_STATE, appData: response}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }

  getAmandeBySeance(){
    this.amande$ = this.seanceService.showAmandeBySeance$(+this.IdParam, this.page - 1, this.size)
      .pipe(
        map(response => {
          this.dataSubjectsSeanceAmande.next(response)
          return {dataState: DataState.LOADED_STATE, appData: response}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }

  getBeneficiaireBySeance(){
    this.benef$ = this.seanceService.showBenefBySeance$(+this.IdParam, this.page - 1, this.size)
      .pipe(
        map(response => {
          this.dataSubjectsSeanceBenef.next(response)
          return {dataState: DataState.LOADED_STATE, appData: response}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }

  getDisciplineBySeance(){
    this.discipline$ = this.seanceService.showDisciplineBySeance$(+this.IdParam, this.page - 1, this.size)
      .pipe(
        map(response => {
          console.log('cotisations', response)
          this.dataSubjectsSeanceDiscipline.next(response)
          return {dataState: DataState.LOADED_STATE, appData: response}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }

  getPretBySeance(){
    this.pret$ = this.seanceService.showPretBySeance$(+this.IdParam, this.page - 1, this.size)
      .pipe(
        map(response => {
          console.log('prets', response)
          this.dataSubjectsSeancePret.next(response)
          return {dataState: DataState.LOADED_STATE, appData: response}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }

  pageChange(event: number){
    this.page = event
    this.cotisation$ = this.seanceService.showCotisationBySeance$(+this.IdParam, this.page - 1, this.size)
      .pipe(
        map(response => {
          this.dataSubjectsSeanceCotisation.next(response)
          return {dataState: DataState.LOADED_STATE, appData: response}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }

  pageChangeDiscipline(event: number){
    this.page = event
    this.discipline$ = this.seanceService.showDisciplineBySeance$(+this.IdParam, this.page - 1, this.size)
      .pipe(
        map(response => {
          this.dataSubjectsSeanceDiscipline.next(response)
          return {dataState: DataState.LOADED_STATE, appData: response}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }

  pageChangeAmande(event: number){
    this.page = event
    this.amande$ = this.seanceService.showAmandeBySeance$(+this.IdParam, this.page - 1, this.size)
      .pipe(
        map(response => {
          this.dataSubjectsSeanceAmande.next(response)
          return {dataState: DataState.LOADED_STATE, appData: response}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }

  pageChangePret(event: number){
    this.page = event
    this.pret$ = this.seanceService.showPretBySeance$(+this.IdParam, this.page - 1, this.size)
      .pipe(
        map(response => {
          this.dataSubjectsSeancePret.next(response)
          return {dataState: DataState.LOADED_STATE, appData: response}
        }),
        startWith({dataState: DataState.LOADING_STATE, appData: null}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error: error})
        })
      )
  }

  open(content: any){
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
  }

  createCotisation() {
    this.isCotise.next(true)
    this.seanceService.createTontine(+this.IdParam).subscribe(
      nex => {
        this.isCotise.next(false)
        this.getCotisationBySeance()
        this.getSoldeTontine()
      },
      error => {
        this.isCotise.next(false)
      }
    );
  }

  //save carton
  saveAmande(){
    this.isLoading.next(true)
    this.amande = this.amandeForm.value
    this.amande.idSeance = +this.IdParam
    // this.mangwa.transaction = "RETRAIT"

    this.seanceService.createAmande(this.amande).subscribe(
      res => {
        this.isLoading.next(false)
        this.getAmandeBySeance()
        this.getSoldeMangwas()
        this.annuler()
      },
      error => {
        this.isLoading.next(false)
      }
    )
  }

  //save carton
  savePret(){
    this.isLoading.next(true)
    // this.pret = this.pretForm.value
    this.pret.idSeance = +this.IdParam
    this.pret.idUser = +this.pretForm.controls['idUser'].value;
    this.pret.montant_prete = +this.pretForm.controls['montant'].value;
    // this.mangwa.transaction = "RETRAIT"

    this.seanceService.createPret(this.pret).subscribe(
      res => {
        this.isLoading.next(false)
        this.getPretBySeance()
        this.getCotisationBySeance()
        this.getSoldeTontine()
        this.annuler()
      },
      error => {
        this.isLoading.next(false)
      }
    )
  }

  saveBenef(){
    this.isLoading.next(true)
    this.beneficiaire.idSeance = +this.IdParam
    this.beneficiaire.idUser = +this.benefForm.controls['idUser'].value;
    this.beneficiaire.montant = +this.benefForm.controls['montant'].value;
    this.seanceService.createBeneficiaire(this.beneficiaire).subscribe(
      res => {
        this.isLoading.next(false)
        this.getCotisationBySeance()
        this.getBeneficiaireBySeance()
        this.getSoldeTontine()
        this.annuler()
      },
      error => {
        this.isLoading.next(false)
      }
    )
  }
  //save carton
  saveDiscipline(){
    this.isLoading.next(true)
    this.discipline.sanction = this.disciplineForm.controls["sanction"].value
    // this.mangwa.transaction = "RETRAIT"

    this.seanceService.createDiscipline(+this.IdParam, +this.disciplineForm.controls["idUser"].value, this.disciplineForm.controls["sanction"].value, this.discipline ).subscribe(
      res => {
        this.isLoading.next(false)
        this.getDisciplineBySeance()
        this.annuler()
      },
      error => {
        this.isLoading.next(false)
      }
    )
  }

  annuler() {
    this.formAmande()
    this.formBenef()
    this.formPret()
    this.formDiscipline()
    this.modalService.dismissAll()
  }

  ngOnDestroy(): void {
    this.userService.getUserss().subscribe().unsubscribe()
  }

  endSeance() {
    this.isLoading.next(true);
    this.loadingFile.next(true)
    this.openLoader()
    this.seanceService.terminerSéance(+this.IdParam).subscribe(
      resp => {
        this.isLoading.next(false);
        this.notifService.onSuccess('Séance terminée')
        this.loadingFile.next(false)
        this.closeLoader()
        const file = new Blob([resp], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      },error => {
        this.loadingFile.next(false)
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

  back() {
    this._location.back()
  }
}
