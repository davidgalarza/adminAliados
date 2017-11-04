import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../helpers';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { AuthenticationService } from '../../../../auth/_services/authentication.service';
import { DatabaseService } from '../../../../database/database.service';
import * as moment from 'moment/moment';


@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./index.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class IndexComponent implements OnInit, AfterViewInit {
    uid: string;
    salesPerMonth: Array<any> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    orderPerMoth: Array<any> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    earnsGrowth: number = 0;
    ordersGrowth: number = 0;
    earnMonth = 0;
    ordersMonth = 0;
    orderValue = 0;
    constructor(private _script: ScriptLoaderService, private auth: AuthenticationService, private db: DatabaseService) {


    }
    ngOnInit() {

    }
    ngAfterViewInit() {
        this.uid = this.auth.getUser().uid;
        this.db.getOrders(this.uid).valueChanges().subscribe(orders => {
            for (var i = 0; i < 12; i++) {
                orders.forEach(order => {
                    let orderData: any = order;
                    let initialDate = moment().date(1).month(i).hour(0).minute(0).second(0);
                    let finishDate = moment().date(1).month(i).hour(0).minute(0).second(0).add('months', 1).date(0);
                    if (moment(orderData.time).isBetween(initialDate, finishDate)) {
                        this.orderPerMoth[i]++;
                        this.salesPerMonth[i] += orderData.products_total;
                        localStorage.setItem('salesPerMonth', JSON.stringify(this.salesPerMonth));
                    }
                });
            }

            this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
                'assets/app/js/index.js');
            if (this.salesPerMonth[moment().months() - 1] != 0) {
                this.earnsGrowth = (this.salesPerMonth[moment().months()] - this.salesPerMonth[moment().months() - 1]) / this.salesPerMonth[moment().months() - 1];
            } else {
                this.earnsGrowth = 100;
            }

            if (this.orderPerMoth[moment().months() - 1] != 0) {
                this.ordersGrowth = (this.orderPerMoth[moment().months()] - this.orderPerMoth[moment().months() - 1]) / this.salesPerMonth[moment().months() - 1];
            } else {
                this.ordersGrowth = 100;
            }
            this.earnMonth = this.salesPerMonth[moment().months()];
            this.ordersMonth = this.orderPerMoth[moment().months()];
            this.orderValue = this.earnMonth / this.ordersMonth;

        });

    }

}