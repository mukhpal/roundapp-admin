import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {HttpService} from '../../../services/http/httpservice';
import {Advertiser} from '../../../models/advertiser';
import {AuthService} from "../../../services/http/authService";


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  advertiserDisplayedColumns: string[] = ['name', 'type', 'email', 'created_at', 'verified'];
  advertiserDataSource = new MatTableDataSource<any>([]);
  advertiserLoadingDataSource = false;


  @ViewChild(MatPaginator, {static: true}) advertiserPaginator: MatPaginator;

  constructor(
    private http: HttpService,
    private auth: AuthService,
  ) { }

  ngOnInit(): void {
    this.http.title = 'Admin';
    this.getAdvertiserData();
  }

  protected getAdvertiserData( ) {
    this.advertiserLoadingDataSource = true;
    this.http.getAdvertisers().subscribe((response: any) => {
      this.setAdvertiserDataSource(response.body.data as Advertiser[]);
      this.advertiserLoadingDataSource = false;
    }, () => {
    });
  }

  protected setAdvertiserDataSource(advertisers: Advertiser[]) {
    const rows = [];
    advertisers.forEach((advertiser, index) => {
      rows.push({
        name: advertiser.user.name,
        type: advertiser.type,
        email: advertiser.user.email,
        created_at: advertiser.user.created_at,
        verified: advertiser.user.verified,
      });
    });
    this.advertiserDataSource = new MatTableDataSource<any>(rows);
    this.advertiserDataSource = new MatTableDataSource<any>(rows);
    this.advertiserDataSource.paginator = this.advertiserPaginator;
  }
}
