import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import "rxjs/add/operator/map";
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class DatabaseService {

    constructor(private http: Http, private db: AngularFireDatabase) {
    }
    getOrders(uid: string) {
        return this.db.list('/orders/', ref => ref.orderByChild('commerceId').equalTo(uid));
    }
    getMenus(uid: string) {
        return this.db.list('/commerces/' + uid + '/menus');
    }
    createProduct(menu: string, name: string, description: string, imageUrl: string, price: number, commerceId: string, questions: Array<any>) {

        return this.db.database.ref().child('products').push({
            menu: menu,
            product: name,
            description: description,
            imageUrl: imageUrl,
            price: price,
            commerceId: commerceId,
            options: questions
        });
    }
    getProducts(uid: string) {
        return this.db.list('/products/', ref => ref.orderByChild('commerceId').equalTo(uid));
    }
    removeProduct(productKey: string) {
        this.db.list('/products/' + productKey).remove();

    }
    getProduct(productKey: string) {
        return this.db.object('/products/' + productKey);
    }
    updateProduct(key: string, menu: string, name: string, description: string, imageUrl: string, price: number, commerceId: string, questions: Array<any>) {

        return this.db.database.ref().child('products').child(key).set({
            menu: menu,
            product: name,
            description: description,
            imageUrl: imageUrl,
            price: price,
            commerceId: commerceId,
            options: questions
        });
    }
    removeMenu(uid:string, menuKey:string){
        this.db.list('/commerces/' + uid + '/menus/' + menuKey).remove();
    
    }
    addMenu(uid:string, menu:string){
        this.db.database.ref().child('commerces').child(uid).child('menus').push(menu);
    }
    getShop(uid: string){
        return this.db.database.ref().child('commerces').child(uid);
    }
    updateProfileInfo(uid:string, billing, shopName: string, shopDescription: string, logoUrl: string, bannerUrl:string){
        this.db.database.ref().child('commerces').child(uid).child('billing').set(billing);
        this.db.database.ref().child('commerces').child(uid).child('name').set(shopName);
        this.db.database.ref().child('commerces').child(uid).child('description').set(shopDescription);
        this.db.database.ref().child('commerces').child(uid).child('logoUrl').set(logoUrl);
        return this.db.database.ref().child('commerces').child(uid).child('bannerUrl').set(bannerUrl);
    }
    getAttention(uid:string){
        return this.db.list('/commerces/' + uid + '/attention');
    }
    setAttention(uid:string, horary:Array<any>){
        console.log(horary);
        this.db.database.ref().child('commerces').child(uid).child('attention').set(horary);
      }
      setLocation(uid:string, lat:number, lng:number){
        this.db.database.ref().child('commerces').child(uid).child('lat').set(lat);
        this.db.database.ref().child('commerces').child(uid).child('lng').set(lng);
      }
      getOrder(id:string){
        return this.db.database.ref().child('orders').child(id);
      }
      setOrderStatus(id:string, status: string){
        this.db.database.ref().child('orders').child(id).child('status').set(status);
      }
      getWorkOfDay(uid: string, day: string){
        return this.db.database.ref().child('commerces').child(uid).child('attention').child(day);
    }
    setWorkOfDay(uid: string, day: string, work: boolean){
        this.db.database.ref().child('commerces').child(uid).child('attention').child(day).child('work').set(work);
    }
}