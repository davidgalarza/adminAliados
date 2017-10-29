import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import "rxjs/add/operator/map";
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class AuthenticationService {

    constructor(private http: Http, private auth: AngularFireAuth) {
    }

    login(email: string, password: string) {
        return this.auth.auth.signInWithEmailAndPassword(email, password);
        /*return this.http.post('/api/authenticate', JSON.stringify({ email: email, password: password }))
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let user = response.json();
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
            });*/
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
    getUser(){
        return this.auth.auth.currentUser;
    }
}