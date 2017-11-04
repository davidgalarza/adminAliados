import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Helpers } from '../../../../helpers';
import { AuthenticationService } from '../../../../auth/_services/authentication.service';
import { DatabaseService } from '../../../../database/database.service';
import { StorageService } from '../../../../storage/storage.service';
import * as moment from 'moment/moment';

declare var $: any;


@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./profile.component.html",
    encapsulation: ViewEncapsulation.None,
})

export class ProfileComponent implements OnInit {

    uid: string;
    mail: string = "";
    shop:any = {};
    logoUrl:string = "";
    bannerUrl: string;
    logo: File;
    banner: File;
    billing = {
        name: "",
        ci: "",
        phone: "",
        address: ""
    }
    shopName: string = "";
    shopDescription:string ="";
    salesPerMonth: Array<any> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    orderPerMoth: Array<any> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    earnMonth = 0;
    ordersMonth = 0;
    orderValue = 0;

    // Time
    attention:Array<any>=[
        {
          open: "",
          close: "",
          work: false
        },
        {
          open: "",
          close: "",
          work: false
        },
        {
          open: "",
          close: "",
          work: false
        },
        {
          open: "",
          close: "",
          work: false
        },
        {
          open: "",
          close: "",
          work: false
        },
        {
          open: "",
          close: "",
          work: false
        },
        {
          open: "",
          close: "",
          work: false
        }
        ];
        // Location conf
        title: string = 'My first AGM project';
        lat: number = 51.678418;
        lng: number = 7.809007;
        zoom: number = 16;
        load: boolean = false;
    
    constructor(private auth: AuthenticationService, private db: DatabaseService, private storage: StorageService) {
        this.uid = this.auth.getUser().uid;
        this.mail = this.auth.getUser().email;
        this.db.getShop(this.uid).on('value', shop=>{
            this.shop = shop.val();
            if(this.shop.billing != undefined){
                this.billing.name = this.shop.billing.name;
                this.billing.ci = this.shop.billing.ci;
                this.billing.phone = this.shop.billing.phone;
                this.billing.address = this.shop.billing.address;
            }
            this.shopName = this.shop.name;
            this.shopDescription = this.shop.description;

            if(this.shop.logoUrl != undefined && this.shop.logoUrl !=""){
                this.logoUrl = this.shop.logoUrl;
            }else{
                this.logoUrl = "./assets/app/media/img/users/profile.png";
            }
            if(this.shop.lat != undefined && this.shop.lng != undefined){
                this.lat = this.shop.lat;
                this.lng = this.shop.lng;
              }else{
                navigator.geolocation.getCurrentPosition((currentPosition)=>{
                  console.log(currentPosition);
                  this.lat = currentPosition.coords.latitude;
                  this.lng = currentPosition.coords.longitude;
                });
              }
            
        });

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
                    }
                });
            }
            this.earnMonth = this.salesPerMonth[moment().months()];
            this.ordersMonth = this.orderPerMoth[moment().months()];
            this.orderValue = this.earnMonth / this.ordersMonth;
        });

        this.updateAttenion(this.uid);

       
    }
    ngOnInit() {

    }
    ngAfterViewInit() {
        $("#profileForm").validate({
            rules: {
                billingName: { required: true},
                ci: { required: true},
                billingPhone: { required: true},
                billingAddress: { required: true},
                shopName: { required: true},
                shopDescription: { required: true},
            }, invalidHandler: function (e, r) {  }, submitHandler: function (e) { }
        });
        $(".pikerTimeProfile").timepicker({
            use24hours: true,
            format: 'HH:mm',
            showMeridian: false ,
            defaultTime: '00:00'
        })

        
          
          
    }
    detectImage($event) {
        this.logo = (<HTMLInputElement>document.getElementById('file1')).files[0];
        
    }
    detectImage2($event){
        this.banner = (<HTMLInputElement>document.getElementById('file2')).files[0];
    }

    updateData(){
        var notify = $.notify('<strong>Verificacion</strong> Verificando informacion...', {
            allow_dismiss: false,
            showProgressbar: true,
            animation: 'bounce',
            timer: 10000
        });
        console.log('Click')
        if(this.billing.name.length == 0 || this.billing.address.length == 0 || this.billing.ci.length == 0 || this.billing.phone.length ==0 || this.shopName.length ==0 || this.shopDescription.length == 0){
            notify.update("message", "<strong>Error</strong> Error en los datos.");
            notify.update("type", "Error");
            notify.update("progress", 100)
        }else{
            console.log("Entro")
           
                notify.update("message", "<strong>Actualizando</strong> imagenes.");
                notify.update("type", "primary");
                notify.update("progress", 30)
            
            this.uploadImages().then(images=>{
                
                    notify.update("message", "<strong>Actualizando</strong> tu información.");
                    notify.update("type", "info");
                    notify.update("progress", 60)
                
                let imgUrls:any = images;
                console.log("Se subio")
                this.db.updateProfileInfo(this.uid, this.billing, this.shopName, this.shopDescription, imgUrls.logoUrl, imgUrls.bannerUrl).then(()=>{
                    console.log("Se actualizo");
                    notify.update("message", "<strong>Actualizado</strong> exitosamente.");
                    notify.update("type", "success"); 
                    notify.update("progress", 100) 
                });
            })
           
        }
        
        
    }
    uploadImages(){
        return new Promise((resolve, reject)=>{
            let logoUrl, bannerUrl;
            let hasLogo, hasBanner;
            if(this.logo == undefined){
                if(this.shop.logoUrl == undefined){
                    logoUrl = "";
                }else{
                    logoUrl = this.shop.logoUrl;
                }
            }else{
                hasLogo = true;
            }
            if(this.banner == undefined){
                if(this.shop.bannerUrl == undefined){
                    bannerUrl = "";
                }else{
                    bannerUrl = this.shop.bannerUrl;
                }
            }else{
                hasBanner = true;
            }
            if(hasLogo && hasBanner){
                this.storage.uploadImage(this.banner, this.uid,this.banner.name).then(banner=>{
                    bannerUrl = banner.downloadURL;
                    this.storage.uploadImage(this.logo,this.uid,this.logo.name).then(logo=>{
                        logoUrl = logo.downloadURL;
                        resolve({logoUrl:logoUrl, bannerUrl: bannerUrl});
                    });
                });
            }else{
                if(hasLogo || hasBanner){
                    if(hasBanner){
                        this.storage.uploadImage(this.banner, this.uid,this.banner.name).then(banner=>{
                            bannerUrl = banner.downloadURL;
                            resolve({logoUrl:logoUrl, bannerUrl: bannerUrl});
                        });
                    }
                    if(hasLogo){
                        this.storage.uploadImage(this.logo,this.uid,this.logo.name).then(logo=>{
                            logoUrl = logo.downloadURL;
                            resolve({logoUrl:logoUrl, bannerUrl: bannerUrl});
                        });
                    }
                }else{
                    resolve({logoUrl:logoUrl, bannerUrl: bannerUrl});
                }
                
            }

        });
    }

    // Tim Config
    updateAttenion(uid:string){
        this.db.getAttention(uid).valueChanges().subscribe(att=>{
            this.attention = att;
        });
    }
    updateTime(){
        console.log($('#lunes').val());
        console.log(this.attention);
        this.db.setAttention(this.uid, [
            {
              open: $('#open0').val(),
              close: $('#close0').val(),
              work: this.attention[0].work
            },
            {
              open: $('#open1').val(),
              close: $('#close1').val(),
              work: this.attention[1].work
            },
            {
              open: $('#open2').val(),
              close: $('#close2').val(),
              work: this.attention[2].work
            },
            {
              open: $('#open3').val(),
              close: $('#close3').val(),
              work: this.attention[3].work
            },
            {
              open: $('#open4').val(),
              close: $('#close4').val(),
              work: this.attention[4].work
            },
            {
              open: $('#open5').val(),
              close: $('#close5').val(),
              work: this.attention[5].work
            },
            {
              open: $('#open6').val(),
              close: $('#close6').val(),
              work: this.attention[6].work
            }
            ]);
    }
    changeCenter($event){
        this.lat =$event.lat;
        this.lng =$event.lng;
      }
      setLocation(){
        console.log("click");
        this.db.setLocation(this.uid, this.lat, this.lng);
      }
      loadMap(load: boolean){
        this.load = load;
        console.log(this.load);

      }


}