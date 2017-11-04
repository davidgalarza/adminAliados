import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import "rxjs/add/operator/map";
import * as firebase from 'firebase';

@Injectable()
export class StorageService {
    private basePath: String = '/uploads';
    constructor(private http: Http) {
    }
    uploadImage(img: File, path: string, fileName: string) {
        let storageRef = firebase.storage().ref(this.basePath + '/' + path + '/' + fileName);
        let task = storageRef.put(img);
        return task;
    }
    removeImage(path: string, fileName: string) {
        firebase.storage().ref(this.basePath + '/' + path + '/' + fileName).delete();
    }

}