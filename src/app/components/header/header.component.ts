import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {Router} from '@angular/router';
import { AuthService } from 'src/app/services/http/authService';
import {HttpService} from '../../services/http/httpservice';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  input: any = {};
  @Output() action = new EventEmitter<any>();
  user: any = {};
  @Input() set inputSide(inputSide: any){
    this.input = inputSide;
  }

  @Input() set userData(user: any){
    this.user = user;
  }


  constructor(
    public router: Router,
    private auth: AuthService,
    public http: HttpService
  ) {
    this.user = auth.getUser();
  }

  ngOnInit(): void {
  }

  sideToggle(){
    this.input = !this.input;
    let obj = {
      data: this.input,
      action: 'sidebar'
    };
    this.action.emit(obj);
  }

  logout(){
    this.auth.logout().subscribe((response: any) => {});
  }

  profile(){
    this.router.navigate(['dash/profile']);
  }

}
