import { Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef } from '@angular/core';
import { Helpers } from '../../../../helpers';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { AuthenticationService } from '../../../../auth/_services/authentication.service';
import { DatabaseService } from '../../../../database/database.service';
import * as moment from 'moment/moment';
declare var $: any;


@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./orders.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class OrdersComponent implements OnInit, AfterViewInit {
    uid: string;
    orders: Array<any> = [];
    firstTime: boolean = true;
    datatable: any;
    shop:any ={
        billing:{address: ""}
    };
    selectedOrder: any = {
        billing:{
            name: '',
            ci:'',
            address: ''
        },
        cart: [
            {cant: 1, name: "Un productos", options: [], price: 21, product: "-KxfVRW8mhk28LkTdr1T"}
        ],
        products_total: 6,
        status: 'pending'
    };
    selectedId: string;
    constructor(private _script: ScriptLoaderService,private elRef: ElementRef, private db: DatabaseService, private auth: AuthenticationService) {
        this.uid = this.auth.getUser().uid;
        this.db.getShop(this.uid).on('value', (ss)=>{
            this.shop = ss.val();
        });
        moment.locale('es');
        this.db.getOrders(this.uid).snapshotChanges().subscribe(ss => {
            this.prepareOrdersData(ss).then(orders => {
                console.log("Ordenes: ", orders);
                if (this.firstTime) {
                    this.createTable();
                    this.detectViewButtons()
                    this.firstTime = false;
                } else {
                    this.datatable.destroy();
                    this.createTable();
                    this.detectViewButtons()
                }

            });
        });
    }
    ngOnInit() {

    }
    ngAfterViewInit() {

    }
    compare(a, b) {
        if (moment(a.time).isBefore(b.time))
            return 1;
        if (moment(a.time).isAfter(b.time))
            return -1;
        return 0;
    }
    createTable() {
        let options = {
            data: {
                type: 'local',
                source: this.orders,
                pageSize: 10,
                saveState: {
                    cookie: false,
                    webstorage: false
                },

                serverPaging: true,
                serverFiltering: false,
                serverSorting: false
            },

            layout: {
                theme: 'default',
                class: 'm-datatable--brand',
                scroll: false,
                height: null,
                footer: false,
                header: true,

                smoothScroll: {
                    scrollbarShown: true
                },

                spinner: {
                    overlayColor: '#000000',
                    opacity: 0,
                    type: 'loader',
                    state: 'brand',
                    message: true
                },
            },

            sortable: false,

            pagination: false,


            // columns definition
            columns: [{
                field: "RecordID",
                title: "#", sortable: !1,
                width: 20, textAlign: "center",
                selector: { class: "m-checkbox--solid m-checkbox--brand" }
            },
            {
                width: 90,
                field: "$key", title: "Pedido ID"
            },
            {
                field: "fromNow",
                title: "Tiempo",
                width: 90
            },
            {
                field: "products_total", title: "Total", width: 60
            },
            {
                field: "status", title: "Estado", width: 100, template: function (t) {
                    var e = {
                        pending: { title: "Pendiente", class: "m-badge--brand" },
                        accepted: { title: "Aceptado", class: " m-badge--metal" }, 
                        assigned: { title: "Asignado", class: " m-badge--warning" },
                        inShop: { title: "Despachado", class: " m-badge--primary" }, 
                        arrived: { title: "Arrivo", class: " m-badge--info" }, 
                        recived: { title: "Recivido", class: " m-badge--success" }, 
                        rated: { title: "Recivido", class: " m-badge--success" }, 
                        refused: { title: "Rechazado", class: " m-badge--danger"},
                    }; return '<span class="m-badge ' + e[t.status].class + ' m-badge--wide">' + e[t.status].title + "</span>"
                }
            },

            {
                field: "Actions",
                width: 80,
                title: "Visualizar",
                sortable: !1,
                overflow: "visible",
                textAlign: "center",
                template: function (t) {
                    return '<a data-cust-id="' + t.$key + '" data-toggle="modal" data-target="#m_modal_4" class="viewB m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit details">\t\t\t\t\t\t\t<i class="la la-eye"></i>\t\t\t\t\t\t</a>'
                }
            }],

            toolbar: {
                layout: ['pagination', 'info'],

                placement: ['bottom'],  //'top', 'bottom'

                items: {
                    pagination: {
                        type: 'default',

                        pages: {
                            desktop: {
                                layout: 'default',
                                pagesNumber: 6
                            },
                            tablet: {
                                layout: 'default',
                                pagesNumber: 3
                            },
                            mobile: {
                                layout: 'compact'
                            }
                        },

                        navigation: {
                            prev: true,
                            next: true,
                            first: true,
                            last: true
                        },

                        pageSizeSelect: [10, 20, 30, 50, 100]
                    },

                    info: true
                }
            },

            translate: {
                records: {
                    processing: 'Please wait...',
                    noRecords: 'No records found'
                },
                toolbar: {
                    pagination: {
                        items: {
                            default: {
                                first: 'Primero',
                                prev: 'Previous',
                                next: 'Next',
                                last: 'Last',
                                more: 'More pages',
                                input: 'Page number',
                                select: 'Select page size'
                            },
                            info: 'Displaying {{start}} - {{end}} of {{total}} records'
                        }
                    }
                }
            }
        };
        this.datatable = $('#ordersData').mDatatable(options);
    }

    prepareOrdersData(orders: Array<any>) {

        return new Promise((resolve, reject) => {
            this.orders = [];
            let orderData: any;
            let count = 0;
            orders.forEach(order => {
                orderData = order.payload.val();
                orderData.$key = "#" + order.key;
                orderData.numP = orderData.cart.length;
                orderData.products_total = '$' +orderData.products_total.toFixed(2);
                orderData.fromNow = moment(orderData.time).fromNow();
                this.orders.push(orderData);
                count++;
                if (count == orders.length) {
                    this.orders.sort(this.compare);
                    resolve(this.orders);
                }

            });
        })
    }
    detectViewButtons(){
        $(this.elRef.nativeElement).find(".viewB").click((e) => {
            let id = $(e.currentTarget).data('cust-id');
            console.log(id);
            this.selectedId = id.substring(1);
            this.getOrder(id.substring(1));
        });
    }
    getOrder(id:string){
        this.db.getOrder(id).on('value',(ss)=>{
            this.selectedOrder = ss.val();
            this.selectedOrder.$key = ss.key;
            console.log(this.selectedOrder);
        });
    }
    accept(){
        this.db.setOrderStatus(this.selectedId,'accepted');
    }
    refuse(){
        this.db.setOrderStatus(this.selectedId,'refused');
    }
}