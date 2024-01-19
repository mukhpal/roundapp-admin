import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import {AuthService} from '../../services/http/authService';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss']
})
export class DashComponent implements OnInit {
  title = 'RoundApp';
  _opened = true;
  user: any;
  isAdmin = false;

  redirectUrl = environment.accessUrl;


  _toggleSidebar() {
    // this._opened = !this._opened;
  }

  constructor(
    private auth: AuthService,
    public router: Router
  ) {
    if (this.router.url === '/dash') {
      this.router.navigate(['dash/index'], { skipLocationChange: true });
    }
  }

  ngOnInit(){
    this.user = this.auth.getUser();
    this.isAdmin = this.auth.isAdmin();
  }

  actionPages(event){
    if (event.action === 'sidebar'){
      this._toggleSidebar();
    }
  }

  onActivate(child) {
    if (child.updateUserEmitter) {
      child.updateUserEmitter.subscribe((userData) => {
        this.user = Object.assign({}, this.auth.getUser(), userData);
      });
    }
  }

}
