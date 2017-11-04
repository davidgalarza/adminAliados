import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from '../../../../auth/_services/authentication.service';
import { DatabaseService } from '../../../../database/database.service';


@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./menus.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class MenusComponent implements OnInit {
    menus: Array<any> = [];
    uid: string;
    menu: string = "";
    constructor(private auth: AuthenticationService, private db:DatabaseService) {
        this.uid = this.auth.getUser().uid;
        this.db.getMenus(this.uid).snapshotChanges().subscribe(ss=>{
            this.menus = [];
            let newMenu: any  = {};
            console.log(ss);

            ss.forEach(menu=>{
                newMenu.name = menu.payload.val();
                newMenu.$key = menu.key;
                this.menus.push(newMenu)
                console.log(this.menus);
            });
            
        })
        
    }
    ngOnInit() {

    }
    ngAfterViewInit() {
        $("#menuForm").validate({
            rules: {
                menuName: { required: true, maxlength: 25 },
            }, invalidHandler: function (e, r) {  }, submitHandler: function (e) { }
        })
    }
    removeMenu(key:string){
        this.db.removeMenu(this.uid, key);
    }
    addMenu(){
        if(this.menu.length >0){
            this.db.addMenu(this.uid, this.menu.toLowerCase());
            this.menu = "";
        }
    }

}