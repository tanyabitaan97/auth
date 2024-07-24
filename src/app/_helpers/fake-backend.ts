import { Injectable } from '@angular/core';

//importing system defined http classes & HTTP_INTERCEPTORS thats enables this calls to intercept http requests
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';

//importing rxjs functions
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

// get a ref to the array in local storage that stored registered users
let users = [{'username':'abcd','password':1234,'id':1,'firstName':'abcd','lastName':'chaudhary','role':'user','token':'asdefrgtjjlll'},
    {'username':'defgh','password':12345,'id':2,'firstName':'abcd','lastName':'chaudhary','role':'admin','token':'asdefrgtjjlll'}]

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        const { url, method, headers, body } = request; //capture the request data and store in temp obj 

        //of() converts the arguments to an observable sequence. imported from rxjs above
        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute)) //pass the custom function below which manages fake REST API urls
            .pipe(materialize()) 
            .pipe(delay(500))
            .pipe(dematerialize());
              
            //mergeMap() - Projects each source value to an Observable which is merged in the output Observable
            /*Materialize()/Dematerialize() - Observable will invoke its observer’s onNext  and then will invoke either the 
              onCompleted or onError method exactly once. The Materialize operator converts this series of invocations — 
              both (onNex, onCompletet,onError) notification — into a series of items emitted by an Observable & vice versa*/
            
        
        function handleRoute() {
            //handle simulated REST api service endpoints similar to configuring routes
            switch (true) {              
                case url.endsWith('/users/register') && method === 'POST':
                    return register(); //call this function defined below
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate(); //call this function defined below
                case url.endsWith('/users') && method === 'GET':
                        return getUsers(); //call this function defined below
                case url.match(/\/users\/\d+$/) && method === 'DELETE':
                        return deleteUser(); //call this function defined below
                default:
                    // pass through any requests not handled above for any other url route provided
                    return next.handle(request);
            }    
        }

        // route functions called above are defined here
        function register() {
            const user = body; //get the user data from the body of the request
   
            if (users.find((x:any) => x.username === user.username)) {  //search for user in localstorage on usernmae
                return error('Username "' + user.username + '" is already taken'); //if found return "already exists"
            }
            
            //if not found register the user
  
            user.id = users.length ? Math.max(...users.map((x:any) => x.id)) + 1 : 1;
            //if users array has data , iterate over the records using map(), select max id value +1
            //if users array has no data, set user.id=1

            users.push(user);   //insert new user record for user registration.push() inbult JS method)
            localStorage.setItem('users', JSON.stringify(users));  //update the new users array in localstorage
            return of(users);
             //ok() defined below, simulates an all ok http response object with status code 200, from REST API
        }

        function authenticate() { //validate the user
            const { username, password } = body;
            console.log(username+' '+password)
            //get the credential from the body data of the request  object
            //search for the user record based on username and password

            //const user = users.filter((x:any) => x.username === username && x.password === password)[0]

            let flag=false;
            let user=undefined;

            users.forEach((x:any)=>{
                if(x.username===username) {
                    flag=true;
                    user=x;
                }
            })

            console.log('users are '+JSON.stringify(users))
            console.log('user is '+user);
            
            //return error if user is not found in the localstorage, based on credentials provided
            if (!flag) return error('Username or password is incorrect');

            //ok(), defined below simulates an all ok http response object with status code 200, from REST API
            //if user is found, return a temp json object, along with a JWT token
            return ok({
                id: user!.id,
                username: user!.username,
                firstName: user!.firstName,
                lastName: user!.lastName,
                role: user!.role,
                token: 'fake-jwt-token' // Dummy JWT Token
            }) 
        }

        function getUsers() {//retreive users with logged in status 
            if (!isLoggedIn()) return unauthorized(); //if not logged in return unauthorized
                                                      //isLoggedIn() defined below
            localStorage.setItem('users', JSON.stringify(users)); 
            return ok();//else return logged in user
            //ok(), defined below simulates an all ok http response object with status code 200, from REST API
        }

        function deleteUser() {//delete user from localstorage
            if (!isLoggedIn()) return unauthorized();  //if not logged in return unauthorized
                                                       //isLoggedIn() defined below

            users = users.filter((x:any) => x.id !== idFromUrl()); 
            //filter() removes the user record from localstorage users array, for  the userid that is passed to the url
            //idFromUrl() defined below. splits the url on '/' seperator and returns the userid segment passed in the url

            localStorage.setItem('users', JSON.stringify(users)); 
            //save the updated users array back to the localstorage
            
            return ok(); 
            //ok(), defined below simulates an all ok http response object with status code 200, from REST API
        }

        //Custom helper functions................

        function ok(body?: {
                id: any; username: any; firstName: any; lastName: any; role:any; token: string; // Dummy JWT Token
            } | undefined) {//simulates an all ok http response object with status code 200, from REST API
                            //? = indicates accpet data in the body paramer or accepts null also
            return of(new HttpResponse({ status: 200, body }))
        }
        function okList(body?: []| undefined) {//simulates an all ok http response object with status code 200, from REST API
                        //? = indicates accpet data in the body paramer or accepts null also
        return of(new HttpResponse({ status: 200, body }))
    }
        function error(message: any) {//throws a custom error message passed to this function
            return throwError({ error: { message } });
        }
        function unauthorized() { //throws http 401 error code
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }
        function isLoggedIn() {/*from the request object above, captures header with 'auth' key having value = JWT token
                               also check for the "Bearer" keyword that is set by the JWT interceptor service for 
                               logged in usres only*/
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }
        function idFromUrl() {//splits the url infro that is captured from the request object defined above.
            const urlParts = url.split('/');  //split the url on every '/' seperator
            return parseInt(urlParts[urlParts.length - 1]); //0 based index, return url segments as an array in int format
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS, //add this class as a fake REST API endpoint to intercept HTTP requests
    useClass: FakeBackendInterceptor,
    multi: true                 //multiple http requests can be handled by this class
};