import {Component, Inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {HttpService} from '../../../services/http/httpservice';
import {AuthService} from '../../../services/http/authService';
import {Campaign} from '../../../models/campaign';
import {Counters} from '../../../models/counters';
import {User} from '../../../models/user';



@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  displayedColumns: string[] = ['id', 'title', 'description', 'producer', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  loadingDataSource = false;

  user: User;
  counters: Counters;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    private http: HttpService,
    private auth: AuthService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.user = auth.getUser();
  }

  ngOnInit(): void {
    this.http.title = 'Dashboard';
    console.log(this.dataSource);
    this.getData();
  }

  public updateCampaign(campaign: any) {
    const id = campaign.id;
    this.router.navigate([`dash/video/${id}`]);
  }

  public deleteCampaign(campaign: any, confirmed = false) {
    if (!confirmed) {
      const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent,  {
        height: '220px',
        width: '450px',
        data: { campaign }
      });
      dialogRef.afterClosed().subscribe(confirm => {
        if (confirm) {
          this.deleteCampaign(campaign, true);
        }
      });
    }
    else {
      const id = campaign.id;
      this.http.deleteCampaign(id).subscribe((response: any) => {
        this.getData();
      }, () => {

      });
    }
  }

  protected getData( ) {
    this.loadingDataSource = true;
    this.http.getCampaigns().subscribe((response: any) => {
      this.setDataSource(response.body.data as Campaign[]);
      this.loadingDataSource = false;
    }, () => {
    });

    this.http.getCounters().subscribe((response: any) => {
      this.counters = response.body.data as Counters;
      this.animateCounter('views_global');
      this.animateCounter('views_paid');
      this.animateCounter('views_free');
      this.animateCounter('views_clicks');
    }, () => {
    });
  }

  protected animateCounter(name) {
    const frequency = 100;
    const duration = 1000;
    const value = this.counters[name];
    this.counters[name] = 0;
    const increment = Math.floor(value * frequency / duration);
    const interval = setInterval(() => {
      if (this.counters[name] + increment >= value) {
        this.counters[name] = value;
        clearInterval(interval);
      }
      else {
        this.counters[name] += increment;
      }
    }, frequency);
  }

  protected setDataSource(campaigns: Campaign[]) {
    const rows = [];
    campaigns.forEach((campaign, index) => {
      rows.push({
        id: campaign.id,
        title: campaign.title,
        description: campaign.description,
        producer: campaign.producer.name
      });
    });
    this.dataSource = new MatTableDataSource<any>(rows);
    this.dataSource.paginator = this.paginator;
    console.log(this.dataSource);
  }
}



@Component({
  selector: 'app-confirm-delete-dialog',
  templateUrl: 'dialogs/confirm-delete-dialog.component.html',
  styleUrls: ['index.component.scss']
})
export class ConfirmDeleteDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  confirm(): void {
    this.dialogRef.close(true);
  }

  abort(): void {
    this.dialogRef.close(false);
  }
}
