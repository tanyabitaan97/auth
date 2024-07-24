import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '../_services/authentication.service';//import custom service

//Custom service class to handle HTTP errors
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) {} //DI

    //override system derfined method
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => { //catch HTTP errors
            if (err.status === 401) { 
                // auto logout if 401 response returned from api
                this.authenticationService.logout(); //call custom auth service method
                location.reload();   //refresh the page
            }
            
            const error = err.error.message || err.statusText;
            return throwError(error);   //throw the error tot the caller
        }))
    }
}