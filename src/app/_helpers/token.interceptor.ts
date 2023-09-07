import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HTTP_INTERCEPTORS
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {TokenService} from "../_services/token/token.service";
import {catchError} from "rxjs/operators";
import {NotifsService} from "../_services/notifications/notifs.service";
import {AuthService} from "../_services/auth.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private tokenService: TokenService, private notifService: NotifsService, private authService: AuthService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
// on récupère le token
    const token = this.tokenService.getToken()
    //s'il existe un token à insérer dans la requête
    if (token !== null) {
      // on clone la requête d'origine
      let clone = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + token),


        // params: request.params.set('code')
      })
      return next.handle(clone).pipe(
        catchError(err => {
          // console.log('erreurs', err)
          if (err.error.message.includes("JWT expired at")) {
            this.notifService.expiredSession()
            // this.authService.refreshToken(request).subscribe(
            //   resp=>{
            //     console.log(resp)
            //   }
            // )
          } else if (err.error.message.includes("Une authentification complète est requise pour accéder à cette ressource")) {
            this.notifService.expiredSession()
          } else {
            this.notifService.onError(err.error.message, '')
          }
          return throwError(err)
        })
      )
    }
    return next.handle(request);
  }
}

export const TokenInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: TokenInterceptor,
  multi: true
}
