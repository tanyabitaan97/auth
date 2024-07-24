import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../_services/authentication.service'; //import custom service

//custom service class that sets the JWT token to the HTTP request header and prefixes it with "Bearer"
//onlhy if the user is logged in
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header as "Bearer" keyword  if jwt token is available
        let currentUser = this.authenticationService.currentUserValue; //get current user from the auth service
        if (currentUser && currentUser.token) {
            request = request.clone({ //clone the HTTP request object
                setHeaders: {  //sets custom value to the HTTP header
                    Authorization: `Bearer ${currentUser.token}` //Prefix "Bearer" to the JWT token
                }
            });
        }
        return next.handle(request); //sends notifcation indicating this method has completed, 
                                     //since this method retuns an observable
    }
}