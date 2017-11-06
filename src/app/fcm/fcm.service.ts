import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import "rxjs/add/operator/take";
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { AuthenticationService } from '../auth/_services/authentication.service';
@Injectable()
export class FcmService {
    uid: string;
    currentMessage = new BehaviorSubject(null);
    messaging = firebase.messaging();
    constructor(private http: Http, private db: AngularFireDatabase, private auth: AuthenticationService) {
        this.uid = this.auth.getUser().uid;
    }
    getPermission() {

        this.messaging.requestPermission().then(() => {
            console.log("Hay permiso");
            return this.messaging.getToken();
        }).then(tocken => {
            this.db.database.ref().child('commerces').child(this.uid).child('gcmTocken').once('value', (ss) => {
                let tockens = Object.values(ss.val() || {});
                if (tockens.length == 0) {
                    this.db.database.ref().child('commerces').child(this.uid).child('gcmTocken').push(tocken);
                } else {
                    if (!(tockens.includes(tocken))) {
                        this.db.database.ref().child('commerces').child(this.uid).child('gcmTocken').push(tocken);
                    }
                }

            });
        }).catch(err => {
            console.log(err)
        });

    }
    reciveMessage(){
        this.messaging.onMessage((payload)=>{
            console.log("Message: ", payload);
            var audio = new Audio('assets/sound.mp3');
            let count = 1;
            audio.addEventListener('ended', function() {
    
                if(count <2){
                    this.currentTime = 0;
                    this.play();
                }

                count++;
            },false);
            audio.play();

            this.currentMessage.next(payload);
        });
    }

}