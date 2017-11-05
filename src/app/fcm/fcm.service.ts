import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import "rxjs/add/operator/map";
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { AuthenticationService } from '../auth/_services/authentication.service';
@Injectable()
export class FcmService {
    uid: string;
    constructor(private http: Http, private db: AngularFireDatabase, private auth: AuthenticationService) {
        this.uid = this.auth.getUser().uid;
    }
    getFCMP() {
        const messaging = firebase.messaging();

        var that = this;
        if ('serviceWorker' in navigator) {

            navigator.serviceWorker.register('firebase-messaging-sw.js').then(function (registration) {
                messaging.requestPermission().then(() => {
                    console.log("Hay permiso");
                    return messaging.getToken();
                }).then(tocken => {
                    that.db.database.ref().child('commerces').child(that.uid).child('gcmTocken').once('value', (ss) => {
                        let tockens = Object.values(ss.val() || {});
                        if (tockens.length == 0) {
                            that.db.database.ref().child('commerces').child(that.uid).child('gcmTocken').push(tocken);
                        } else {
                            if(!(tockens.includes(tocken))){
                                that.db.database.ref().child('commerces').child(that.uid).child('gcmTocken').push(tocken);
                            }
                        }

                    });
                }).catch(err => {
                    console.log(err)
                });
            }).catch(function (err) {
                console.log("Error: ", err);
            });
        }


    }

    getFCM() {
        return firebase.messaging();
    }

}