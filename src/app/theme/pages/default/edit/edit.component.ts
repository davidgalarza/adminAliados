import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../helpers';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { AuthenticationService } from '../../../../auth/_services/authentication.service';
import { DatabaseService } from '../../../../database/database.service';
import { StorageService } from '../../../../storage/storage.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
declare let Dropzone: any;

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./edit.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class EditComponent implements OnInit, AfterViewInit {
    productKey: string;
    questions: Array<any> = [];
    uid: string;
    product: string = "";
    description: string;
    price: number;
    menu: string;
    image: File;
    imageUrl: string;
    menus: Array<any> = [];
    options: {
        position: ["bottom", "left"],
        timeOut: 5000,
        lastOnBottom: true

    }
    constructor(private route: ActivatedRoute, private _script: ScriptLoaderService, private auth: AuthenticationService, private db: DatabaseService, private up: StorageService) {
        this.uid = this.auth.getUser().uid;
        this.productKey = route.snapshot.params['id'];
        this.db.getProduct(this.productKey).valueChanges().subscribe(ss => {
            let snap: any = ss;
            console.log(snap);
            this.product = snap.product;
            this.description = snap.description;
            this.price = snap.price;
            this.menu = snap.menu;
            this.imageUrl = snap.imageUrl;
            this.questions = snap.options;
            console.log(this.questions);
        });
        console.log("En edit: ", this.productKey);
        this.db.getMenus(this.uid).valueChanges().subscribe(menus => {
            this.menus = menus;
            console.log(this.menus);
        });

    }
    ngOnInit() {

    }
    ngAfterViewInit() {
    }
    trackByIndex(index: number, obj: any): any {
        return index;
    }
    createQuetions(questions: number) {
        this.questions = [];
        for (let i = 0; i < questions; i++) {

            this.questions.push({
                question: "",
                option1: {
                    answer: "",
                    price: 0
                },
                option2: {
                    answer: "",
                    price: 0
                },
                option3: {
                    answer: "",
                    price: 0
                },
                option4: {
                    answer: "",
                    price: 0
                }
            });
        }
        console.log(this.questions)
    }

    create() {
        console.log(this.questions)
        console.log(this.product);
        console.log(this.description);
        console.log(this.price)
        console.log(this.menu);
    }
    detectImage($event) {
        this.image = (<HTMLInputElement>document.getElementById('file2')).files[0];
        console.log(this.image.name)
    }

    updateProduct() {
        if (this.image == null) {
            if (this.questions == undefined) {
                this.questions = [];
            }
            this.db.updateProduct(this.productKey, this.menu, this.product, this.description, this.imageUrl, this.price, this.uid, this.questions);
        } else {
            this.up.uploadImage(this.image, this.uid + '/products', this.product).then(s => {
                let imageUrl = s.downloadURL;
                this.db.updateProduct(this.productKey, this.menu, this.product, this.description, imageUrl, this.price, this.uid, this.questions).then(s => {

                });
            });
        }

    }

}