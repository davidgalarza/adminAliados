import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ScriptLoaderService } from "../_services/script-loader.service";
import { AuthenticationService } from "./_services/authentication.service";
import { AlertService } from "./_services/alert.service";
import { UserService } from "./_services/user.service";
import { AlertComponent } from "./_directives/alert.component";
import { LoginCustom } from "./_helpers/login-custom";
import { Helpers } from "../helpers";

@Component({
    selector: ".m-grid.m-grid--hor.m-grid--root.m-page",
    templateUrl: './templates/login-1.component.html',
    encapsulation: ViewEncapsulation.None
})

export class AuthComponent implements OnInit {
    model: any = {};
    loading = false;
    returnUrl: string;

    @ViewChild('alertSignin', { read: ViewContainerRef }) alertSignin: ViewContainerRef;
    @ViewChild('alertSignup', { read: ViewContainerRef }) alertSignup: ViewContainerRef;
    @ViewChild('alertForgotPass', { read: ViewContainerRef }) alertForgotPass: ViewContainerRef;

    constructor(private _router: Router,
        private _script: ScriptLoaderService,
        private _userService: UserService,
        private _route: ActivatedRoute,
        private _authService: AuthenticationService,
        private _alertService: AlertService,
        private cfr: ComponentFactoryResolver) {
    }

    ngOnInit() {
        this.model.remember = true;
        // get return url from route parameters or default to '/'
        this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
        this._router.navigate([this.returnUrl]);

        this._script.load('body', 'assets/vendors/base/vendors.bundle.js', 'assets/demo/default/base/scripts.bundle.js')
            .then(() => {
                Helpers.setLoading(false);
                LoginCustom.init();
            });
    }

    signin() {
        this.loading = true;
        this._authService.login(this.model.email, this.model.password).then(user => {
            console.log("Usuario", user);
            console.log(this.returnUrl);
            localStorage.setItem('currentUser', JSON.stringify(user));
            this._router.navigate([this.returnUrl]).then(ss => {
                console.log(ss);
            }).catch(error => {
                console.log(error)
            });
        }).catch(err => {
            this.showAlert('alertSignin');
            this._alertService.error(err.message);
            this.loading = false;
        });
    }

    signup() {
        this.loading = true;
        this._userService.create(this.model)
            .subscribe(
            data => {
                this.showAlert('alertSignin');
                this._alertService.success('Thank you. To complete your registration please check your email.', true);
                this.loading = false;
                LoginCustom.displaySignInForm();
                this.model = {};
            },
            error => {
                this.showAlert('alertSignup');
                this._alertService.error(error);
                this.loading = false;
            });
    }

    forgotPass() {
        this.loading = true;
        this._userService.forgotPassword(this.model.email).then(ss => {
            this.showAlert('alertSignin');
            this._alertService.success('Cool! Se enviaron instrucciones a tu correo.', true);
            this.loading = false;
            LoginCustom.displaySignInForm();
            this.model = {};
        }).catch(error => {
            this.showAlert('alertForgotPass');
            this._alertService.error(error);
            this.loading = false;
        });
    }

    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }
}