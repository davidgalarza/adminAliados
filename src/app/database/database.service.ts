import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import "rxjs/add/operator/map";
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class DatabaseService {

    constructor(private http: Http, private db: AngularFireDatabase) {
    }
    getOrders(uid: string){
        return this.db.list('/orders/',ref => ref.orderByChild('commerceId').equalTo(uid));
    }

}