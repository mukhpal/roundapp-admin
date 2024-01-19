import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/services/http/authGuard';
import { AdminGuard } from 'src/app/services/http/adminGuard';
import { DashComponent } from './dash.component';
import {StatsComponent} from './stats/stats.component';
import {VideoComponent} from './video/video.component';
import {IndexComponent} from './index/index.component';
import {ProfileComponent} from './profile/profile.component';
import {AdminComponent} from './admin/admin.component';


const routes: Routes = [
    {
      path: 'dash', component: DashComponent, canActivate: [AuthGuard], runGuardsAndResolvers: 'always',
      children: [
        { path: 'index', component: IndexComponent },
        { path: 'profile', component: ProfileComponent },
        { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
        { path: 'stats', component: StatsComponent },
        { path: 'video', component: VideoComponent },
        { path: 'video/:id', component: VideoComponent },
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashRoutingModule { }
