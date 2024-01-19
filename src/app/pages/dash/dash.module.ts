import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashRoutingModule } from './dash-routing.module';
import { DashComponent } from './dash.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SidebarModule } from 'ng-sidebar';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { UploaderModule  } from '@syncfusion/ej2-angular-inputs';
import { AppMaterialModule } from 'src/app/app-material.module';
import { ChartsModule } from 'ng2-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageService } from 'src/app/services/pageService/pageService';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faSquare, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { HttpService } from 'src/app/services/http/httpservice';
import { Interceptor } from 'src/app/services/http/interceptor';
import {StatsComponent} from './stats/stats.component';
import {VideoComponent} from './video/video.component';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {NgxFilesizeModule} from 'ngx-filesize';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {GooglePlaceModule} from 'ngx-google-places-autocomplete';
import {ConfirmDeleteDialogComponent, IndexComponent} from './index/index.component';
import { ProfileComponent } from './profile/profile.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { FileuploadComponent } from '../../components/fileupload/fileupload.component';
import {PayinDialogComponent} from './profile/dialogs/payin-dialog.component';
import {PayoutDialogComponent} from './profile/dialogs/payout-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {CardModule} from 'ngx-card';
import {NgxSkeletonLoaderModule} from 'ngx-skeleton-loader';
import { AdminComponent } from './admin/admin.component';
import {MatTabsModule} from "@angular/material/tabs";

@NgModule({
    declarations: [
        DashComponent,
        StatsComponent,
        VideoComponent,
        HeaderComponent,
        IndexComponent,
        ConfirmDeleteDialogComponent,
        PayinDialogComponent,
        PayoutDialogComponent,
        ProfileComponent,
        FileuploadComponent,
        AdminComponent
    ],
  imports: [
    DashRoutingModule,
    CommonModule,
    AppMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    SidebarModule.forRoot(),
    UploaderModule,
    ChartsModule,
    FontAwesomeModule,
    MatProgressBarModule,
    NgxMatSelectSearchModule,
    NgxFilesizeModule,
    GooglePlaceModule,
    MatButtonToggleModule,
    MatDialogModule,
    CardModule,
    NgxSkeletonLoaderModule,
    MatTabsModule
  ],
    exports: [
        ProfileComponent
    ],
    providers: [
        PageService,
        HttpService,
        {provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true}
    ]
})
export class DashModule {
  constructor(private library: FaIconLibrary) {
    library.addIcons(faSquare, faCheckSquare);
  }
}
