import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../helpers';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { AuthenticationService } from '../../../../auth/_services/authentication.service';
import { DatabaseService } from '../../../../database/database.service';
import * as moment from 'moment/moment';

declare var Chart;
declare var $;
declare var mUtil;

@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./index.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class IndexComponent implements OnInit, AfterViewInit {
    uid: string;
    shop: any = {};
    salesPerMonth: Array<any> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    orderPerMoth: Array<any> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    earnsGrowth: number = 0;
    ordersGrowth: number = 0;
    earnMonth = 0;
    ordersMonth = 0;
    orderValue = 0;
    active: boolean = true;
    day: number;
    totalSales = 0;
    constructor(private _script: ScriptLoaderService, private auth: AuthenticationService, private db: DatabaseService) {
        let actualDate = moment().day();
        if (actualDate == 0) {
            this.day = 6;
        } else {
            this.day = actualDate - 1;
        }
    }
    ngOnInit() {

    }
    ngAfterViewInit() {
        this.uid = this.auth.getUser().uid;
        console.log(this.uid);
        this.db.getShop(this.uid).on('value', (ss) => {
            this.shop = ss.val();
            console.log(this.shop);
        });
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
                        this.totalSales = 0;
                        this.salesPerMonth.forEach(moth=>{
                            this.totalSales += moth;
                        })
                    }
                });

            }





            if (this.salesPerMonth[moment().months() - 1] != 0) {
                this.earnsGrowth = Math.ceil(((this.salesPerMonth[moment().months()] - this.salesPerMonth[moment().months() - 1]) / this.salesPerMonth[moment().months() - 1]) * 100);
            } else {
                this.earnsGrowth = 100;
            }

            if (this.orderPerMoth[moment().months() - 1] != 0) {
                this.ordersGrowth = Math.ceil(((this.orderPerMoth[moment().months()] - this.orderPerMoth[moment().months() - 1]) / this.salesPerMonth[moment().months() - 1]) * 100);
            } else {
                this.ordersGrowth = 100;
            }
            this.earnMonth = this.salesPerMonth[moment().months()];
            this.ordersMonth = this.orderPerMoth[moment().months()];
            this.orderValue = this.earnMonth / this.ordersMonth;

        });
        if (this.shop.status == 'showed') {
            this.generateChart();
            this.db.getWorkOfDay(this.uid, this.day.toString()).on('value', (ss) => {
                this.active = ss.val().work;
            });
        }
    }
    changeState() {
        setTimeout(() => {
            console.log(this.active);

            this.db.setWorkOfDay(this.uid, this.day.toString(), this.active);
        }, 100)

    }
    generateChart() {

        new Chart($("#m_chart_sales_stats"), {
            type: "line",
            data: {
                labels:
                ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Augosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
                datasets: [{
                    label: "Ventas", borderColor: mUtil.getColor("brand"), borderWidth: 2, pointBackgroundColor: mUtil.getColor("brand"), backgroundColor: mUtil.getColor("accent"), pointHoverBackgroundColor: mUtil.getColor("danger"), pointHoverBorderColor: Chart.helpers.color(mUtil.getColor("danger")).alpha(.2).rgbString(),
                    data: JSON.parse(localStorage.getItem('salesPerMonth'))
                }]
            }, options: {
                title: { display: !1 },
                tooltips: {
                    intersect: !1, mode: "nearest", xPadding: 10, yPadding: 10, caretPadding: 10
                },
                legend: {
                    display: !1, labels: { usePointStyle: !1 }
                },
                responsive: !0,
                maintainAspectRatio: !1,
                hover: {
                    mode: "index"
                },
                scales: {
                    xAxes: [{ display: !1, gridLines: !1, scaleLabel: { display: !0, labelString: "Month" } }], yAxes: [{ display: !1, gridLines: !1, scaleLabel: { display: !0, labelString: "Value" } }]
                },
                elements: {
                    point: {
                        radius: 3,
                        borderWidth: 0,
                        hoverRadius: 8,
                        hoverBorderWidth: 2
                    }
                }
            }
        });

    }
    start() {
        this.db.setStatus(this.uid, 'showed').then(() => {
            this.db.setDisabled(this.uid, false);
        })
    }

}