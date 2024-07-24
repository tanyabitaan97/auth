import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../_models/user'
import {environment} from '../environments/environment'

//custom service that calls the fake REST APi urls
@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { } //DI to enable http REST API calls
    
    register(user: User) { //accepts user to register via the fake REST api
        return this.http.post(`${environment.apiUrl}/users/register`, user);
    }

    getAll() { //gets list of users that are logged In via the fake REST API
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    delete(id: number) {//accepts the id of the user record to delete from the localstorage via the fake REST API
        return this.http.delete(`${environment.apiUrl}/users/${id}`);
    }
}