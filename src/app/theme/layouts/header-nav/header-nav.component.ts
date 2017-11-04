import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../helpers';
import { AuthenticationService } from '../../../auth/_services/authentication.service';
import { DatabaseService } from '../../../database/database.service';
import { Router } from '@angular/router';

declare let mLayout: any;
@Component({
    selector: "app-header-nav",
    templateUrl: "./header-nav.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class HeaderNavComponent implements OnInit, AfterViewInit {
    uid: string;
    shopName: string;
    logoUrl: string = '';
    mail: string ="";
    bannerUrl: string ="";
    hasLogo: boolean = true;
    constructor(private auth: AuthenticationService, private db: DatabaseService, private router: Router) {
        let shopData: any;
        this.uid = this.auth.getUser().uid;
        this.mail = this.auth.getUser().email;
        this.db.getShop(this.uid).on('value', shop=>{
            shopData = shop.val();
            this.bannerUrl = shopData.bannerUrl;
            this.shopName = shopData.name;
            if(shopData.logoUrl != undefined && shopData.logoUrl!= ""){
                this.logoUrl = shopData.logoUrl;
            }else{
                this.hasLogo = false;
                this.logoUrl = "./assets/app/media/img/users/profile.png";
            }
        });
    }
    ngOnInit() {

    }
    ngAfterViewInit() {

        mLayout.initHeader();

    }
    logout(){
        console.log("Salir");
        this.auth.logout().then(()=>{
            this.router.navigate(['/login/']);
        })
    }

}