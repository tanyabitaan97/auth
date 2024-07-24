import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; //import system defined http module
import { BehaviorSubject, Observable } from 'rxjs'; //import system defined rxjs
import { map } from 'rxjs/operators';

//import custom classes 
import { User } from '../_models/user';                  // user object schema
import {environment} from '../environments/environment'; // custom fake REST aPI config 

//custom service to store the users records details along with the JWT tokens in the local storage
@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) { //DI to call the fake REST API
        this.currentUserSubject = new BehaviorSubject<User>(JSON.
            parse(localStorage.getItem('currentUser') || '{}'));
        //get the currrent user data from loca storage wrapped as a Subject (=better implementation of a Promise)

        this.currentUser = this.currentUserSubject.asObservable();
        //convert from Suibject type to Observable type
    }

    public get currentUserValue(): User { //custom method that returns user record
        return this.currentUserSubject.value;
    }

    login(username:any, password:any) { //custom method that accepts user credentials, logs in  the user, store in localstorage

        console.log('login user')
                                   //posts the user credentials to the fake REST API for authentication
        return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, { username, password })
            .pipe(map(user => {
                localStorage.setItem('currentUser', JSON.stringify(user));
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                //if the user is authenticated by the fake REST API
                this.currentUserSubject.next(user); //sends notification on the obervable 
                console.log('user')                 //indicates authentication is done , 
                                                    //can call the next method for user
                return user;                        //returns the authenticated user record
            }));
    }

    logout() {//custom method to remove user record from local storage and set current user to null
        localStorage.removeItem('currentUser'); 
        this.currentUserSubject.next(new User()); //sends notification on the obervable ,indicates authentication is done 
                                            //passing null invalidates the context for deleted user   
                                            //will not permit any further function calls for the deleted user
    }
}