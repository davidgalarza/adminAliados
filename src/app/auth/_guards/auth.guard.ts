import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { UserService } from "../_services/user.service";
import { Observable } from "rxjs/Rx";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private _router: Router, private _userService: UserService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        return this._userService.verify().map(
            authInfo => {
                if(authInfo != null && authInfo != undefined){
                    return true;
                }else{
                    this._router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
                    return false;
                }
            }
        );
    }
}