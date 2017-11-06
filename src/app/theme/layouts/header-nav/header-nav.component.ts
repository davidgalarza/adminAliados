import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../helpers';
import { AuthenticationService } from '../../../auth/_services/authentication.service';
import { DatabaseService } from '../../../database/database.service';
import { FcmService } from '../../../fcm/fcm.service';
import { Router } from '@angular/router';
import * as moment from 'moment/moment';

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
    mail: string = "";
    bannerUrl: string = "";
    hasLogo: boolean = true;
    message;
    myNotOrders: Array<any> = [];
    constructor(private auth: AuthenticationService, private db: DatabaseService, private router: Router, private fcm: FcmService) {
        let shopData: any;
        this.uid = this.auth.getUser().uid;
        this.mail = this.auth.getUser().email;
        this.db.getShop(this.uid).on('value', shop => {
            shopData = shop.val();
            this.bannerUrl = shopData.bannerUrl;
            this.shopName = shopData.name;
            if (shopData.logoUrl != undefined && shopData.logoUrl != "") {
                this.logoUrl = shopData.logoUrl;
            } else {
                this.hasLogo = false;
                this.logoUrl = "./assets/app/media/img/users/profile.png";
            }
        });

    }
    ngOnInit() {
        this.fcm.getPermission();
        this.fcm.reciveMessage();
        this.message = this.fcm.currentMessage;
    }
    ngAfterViewInit() {
        let interval1;
        let interval2;
        mLayout.initHeader();
        this.db.getOrders(this.uid).valueChanges().subscribe(orders => {
            this.myNotOrders = [];

            orders.forEach(order => {
                let orderData: any = order;

                let minTime = moment().subtract(1, 'hours');
                if (moment(orderData.time).isAfter(minTime)) {
                    if (orderData.status == 'pending') {
                        this.myNotOrders.push(order);
                    }
                }   
            });

            setTimeout(()=>{

                if(this.myNotOrders.length>0){
                    clearInterval(interval1);
                    clearInterval(interval2);
                    interval1 = setInterval(function () {
                            $("#m_topbar_notification_icon1 .m-nav__link-icon").addClass("m-animate-shake"), $("#m_topbar_notification_icon1 .m-nav__link-badge").addClass("m-animate-blink")
                    }, 3e3);
                    interval2 = setInterval(function () {
                        $("#m_topbar_notification_icon1 .m-nav__link-icon").removeClass("m-animate-shake"), $("#m_topbar_notification_icon1 .m-nav__link-badge").removeClass("m-animate-blink");
                    }, 6e3)
                }else{
                    $("#m_topbar_notification_icon1 .m-nav__link-icon").removeClass("m-animate-shake"), $("#m_topbar_notification_icon1 .m-nav__link-badge").removeClass("m-animate-blink");
                    console.log('se limpio');
                    console.log(interval1);
                    console.log(interval2);
                    clearInterval(interval1);
                    clearInterval(interval2);
                }
            },1000);
        })

    }
    logout() {
        console.log("Salir");
        this.auth.logout().then(() => {
            this.router.navigate(['/login/']);
        })
    }
    compare(a, b) {
        if (moment(a.time).isBefore(b.time))
            return 1;
        if (moment(a.time).isAfter(b.time))
            return -1;
        return 0;
    }

}