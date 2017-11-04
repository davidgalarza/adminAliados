import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { LayoutModule } from '../../../layouts/layout.module';
import { DefaultComponent } from '../default.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';

const routes: Routes = [
    {
        "path": "",
        "component": DefaultComponent,
        "children": [
            {
                "path": "",
                "component": ProfileComponent
            }
        ]
    }
];
@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), LayoutModule,FormsModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyCK9TlzRbOT294J5p06HXnSDWR_7s99vz4'
          })

    ], exports: [
        RouterModule
    ], declarations: [
        ProfileComponent
    ], schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class ProfileModule {



}