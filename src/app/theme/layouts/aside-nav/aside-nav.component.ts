import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../helpers';
import { AuthenticationService } from '../../../auth/_services/authentication.service';
import { DatabaseService } from '../../../database/database.service';
import * as moment from 'moment/moment';
declare let mLayout: any;
@Component({
    selector: "app-aside-nav",
    templateUrl: "./aside-nav.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class AsideNavComponent implements OnInit, AfterViewInit {
    uid: string;
    myNotOrders: Array<any> = [];
    constructor(private auth: AuthenticationService, private db: DatabaseService) {
        this.uid = this.auth.getUser().uid;
    }
    ngOnInit() {

    }
    ngAfterViewInit() {

        mLayout.initAside();
        let menu = (<any>$('#m_aside_left')).mMenu(); let item = $(menu).find('a[href="' + window.location.pathname + '"]').parent('.m-menu__item'); (<any>$(menu).data('menu')).setActiveItem(item);
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
        });
    }

}