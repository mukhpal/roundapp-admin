import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/http/authService';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.scss']
})
export class SiteComponent implements OnInit {

  isGuest: boolean;

  redirectUrl = environment.accessUrl;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
    this.isGuest = auth.isGuest();
  }

  ngOnInit(): void {
    this.router.navigate(['dash/index']);
  }

}
