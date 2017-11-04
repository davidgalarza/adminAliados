import { Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef } from '@angular/core';
import { Helpers } from '../../../../helpers';
import { Router } from '@angular/router';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { AuthenticationService } from '../../../../auth/_services/authentication.service';
import { DatabaseService } from '../../../../database/database.service';
import { StorageService } from '../../../../storage/storage.service';
import { Observable } from 'rxjs/Observable';
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';
declare let Dropzone: any;

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./products.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class ProductsComponent implements OnInit, AfterViewInit {
    products: Array<any> = [];
    products2: any;
    menus: Array<any> = [];
    menu: string;
    options: {
        position: ["bottom", "left"],
        timeOut: 5000,
        lastOnBottom: true

    }
    constructor(private route: Router, private elRef: ElementRef, private _script: ScriptLoaderService, private auth: AuthenticationService, private db: DatabaseService, private up: StorageService, private _notificationsService: NotificationsService) {
        this.db.getMenus(this.auth.getUser().uid).valueChanges().subscribe(menus => {
            this.menus = menus;
            console.log(this.menus);
        });
        this.products2 = this.db.getProducts(this.auth.getUser().uid).snapshotChanges().subscribe(snap => {
            let count = 0
            let newProduct;
            this.products = [];
            snap.forEach(product => {
                newProduct = product.payload.val();
                newProduct.key = product.key;
                this.products.push(newProduct);
                if (snap.length - 1 == count) {
                    console.log("enTRO:", this.products);
                    localStorage.setItem("products", JSON.stringify(this.products));
                }
                count++;
            });

        });

    }
    ngOnInit() {

    }

    ngAfterViewInit() {
        this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
            'assets/app/js/products.js').then(() => {
                setTimeout(() => {
                    console.log($(this.elRef.nativeElement).find(".deleteB"));
                    $(this.elRef.nativeElement).find(".deleteB").click((e) => {
                        let id = $(e.currentTarget).data('cust-id');
                        e.currentTarget.parentElement.parentElement.parentElement.remove();
                        console.log(id);
                        this.deleteproduct(id);
                    });
                    $(this.elRef.nativeElement).find(".editB").click((e) => {
                        let id = $(e.currentTarget).data('cust-id');
                        this.route.navigate(['/edit/' + id]);
                    });
                }, 1500);
            });

    }
    deleteproduct(id: string) {
        this.db.removeProduct(id);
    }

}