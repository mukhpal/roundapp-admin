import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../services/http/authService';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {
  email: string;
  verified: boolean;
  sent: number;

  redirectUrl = environment.accessUrl;

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router
  ) {
    const user = auth.getUser();
    this.email = user && user.email ? user.email : '';
    this.verified = auth.isVerified();
    this.sent = 0;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      if (params && (params.id > 0) && params.hash) {
        const data = {
          id: params.id,
          hash: params.hash,
          expires: this.route.snapshot.queryParamMap.get('expires'),
          signature: this.route.snapshot.queryParamMap.get('signature')
        };
        this.verify(data);
      }
    });
  }

  resend() {
    this.sent = 1;
    this.auth.resend().subscribe(
      (result: any) => {
        this.sent = 3;
    }, (error) => {
        // Error requesting new link
        this.sent = -2;
      });
  }

  verify(data: any) {
    this.sent = 2;
    this.auth.verify(data).subscribe(
      (result: any) => {
        this.verified = true;
        this.auth.markAsVerified();
        const self = this;
        setTimeout(() => {
          self.router.navigate([self.redirectUrl]);
        }, 5000);
      }, (error) => {
        // Link validation error
        this.sent = -1;
      });
  }

  logout(){
    this.auth.logout().subscribe((response: any) => {});
  }
}
