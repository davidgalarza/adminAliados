import { Component, OnInit, ViewEncapsulation, AfterViewInit, NgZone } from '@angular/core';
import { Helpers } from '../../../../helpers';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { AuthenticationService } from '../../../../auth/_services/authentication.service';
import { DatabaseService } from '../../../../database/database.service';
import { StorageService } from '../../../../storage/storage.service';
import { Observable } from 'rxjs/Observable';
import { NotificationsService } from 'angular2-notifications';

declare let Dropzone: any;
declare var $: any;

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./newproduct.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class NewproductComponent implements OnInit, AfterViewInit {
    questions: Array<any> = [];
    uid: string;
    product: string = "";
    description: string;
    price: number;
    menu: string;
    image: File;
    imageUrl: string;
    menus: Array<any> = [];

    public options: {
        position: ["bottom", "left"],
        timeOut: 5000,
        lastOnBottom: true
    }
    constructor(private zone: NgZone, private _service: NotificationsService, private _script: ScriptLoaderService, private auth: AuthenticationService, private db: DatabaseService, private up: StorageService) {
        this.uid = this.auth.getUser().uid;
        this.db.getMenus(this.uid).valueChanges().subscribe(menus => {
            this.menus = menus;
            console.log(this.menus);
        });


    }
    ngOnInit() {

    }
    ngAfterViewInit() {
        this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
            'assets/app/js/form.js');


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
    createProduct() {
        var notify = $.notify('<strong>Verificacion</strong> Verificando informacion...', {
            allow_dismiss: false,
            showProgressbar: true,
            animation: 'bounce',
            timer: 10000
        });
        if (this.product.length > 25 || this.product.length == 0 || this.description.length == 0 || this.description.length > 75 || this.price <= 0 || this.price == null || this.menu == "" || this.image.name == "" || this.image.name == undefined || this.image.name == null) {
            notify.update("message", "<strong>Error</strong> Error en los datos.");
            notify.update("type", "Error");
            notify.update("progress", 100)
        } else {
            console.log("click");
            notify.update("message", "<strong>Subiendo</strong> imagen.");
            notify.update("type", "primary");
            notify.update("progress", 20)
            this.up.uploadImage(this.image, this.uid + '/products', this.product).then(s => {
                let imageUrl = s.downloadURL;
                notify.update("message", "<strong>Creando</strong> tu producto.");
                notify.update("type", "info");
                notify.update("progress", 50)
                this.db.createProduct(this.menu, this.product, this.description, imageUrl, this.price, this.uid, this.questions).then(s => {
                    
                }).then(asda => {
                    this.menu = "";
                    this.product = "";
                    this.description = "";
                    this.image = null;
                    this.price = null;
                    this.questions = [];
                    notify.update("message", "<strong>Creado</strong> exitosamente.");
                    notify.update("type", "success"); 
                    notify.update("progress", 100) 
                });
            });

        }
    }

    created($event) {
        console.log($event);
    }

}