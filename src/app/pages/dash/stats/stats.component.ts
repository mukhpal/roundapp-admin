import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSelect} from '@angular/material/select';
import { ReplaySubject, Subject } from 'rxjs';
import {debounceTime, delay, tap, filter, map, takeUntil} from 'rxjs/operators';
import {HttpService} from '../../../services/http/httpservice';
import { Producer } from '../../../models/producer';
import {LineChart} from '../../../models/lineChart';
import {BaseChartDirective} from 'ng2-charts';
import {Campaign} from '../../../models/campaign';


@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

  producers: Producer[] = [];
  filteredProducers: Producer[] = [];

  campaigns: Campaign[] = [];
  filteredCampaigns: Campaign[] = [];

  /** control for the selected producers for server side filtering */
  public producerCtrl: FormControl = new FormControl();

  /** control for filter for server side. */
  public producerFilteringCtrl: FormControl = new FormControl();

  /** indicate search operation is in progress */
  public searchingProducer = false;

  /** control for the selected producers for server side filtering */
  public campaignCtrl: FormControl = new FormControl();

  /** control for filter for server side. */
  public campaignFilteringCtrl: FormControl = new FormControl();

  /** indicate search operation is in progress */
  public searchingCampaign = false;

  public searchingCampaignStats = false;

  public stats: any;

  form: FormGroup;

  range: FormGroup;

  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  chartData: LineChart = {
    datasets: [],
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    colors: [
      { backgroundColor: 'rgba(0,212,255,0.3)' },
      { backgroundColor: 'rgba(0,212,255,0.3)' },
      { backgroundColor: 'rgba(0,212,255,0.3)' },
      { backgroundColor: 'rgba(0,212,255,0.3)' },
      // { backgroundColor: 'rgba(0,110,255,0.3)' },
      // { backgroundColor: 'rgba(191,255,0,0.3)' },
      // { backgroundColor: 'rgba(224,42,42,0.3)' }
    ],
    options: {
      legend: false
    }
  };

  cards: any = [
    { label: 'Totale raggiunti', counter: '12K', percent: '↑ +3,2%', icon: 'account_circle', selected: true },
    { label: 'A pagamento', counter: '8K', percent: '↓ +1,1%', icon: 'euro', selected: false },
    { label: 'Gratuite', counter: '4K', percent: '↓ -1,8%', icon: 'free_breakfast', selected: false },
    { label: 'Visite al sito', counter: '6K', percent: '↑ +2,6%', icon: 'public', selected: false },
  ];

  constructor(private http: HttpService, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.http.title = 'I miei video';
    this.chart = this.chartData as BaseChartDirective;
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    this.range = this.formBuilder.group({
      start: [firstDayOfMonth, [Validators.required]],
      end: [lastDayOfMonth, [Validators.required]],
    }, {
      updateOn: 'change'
    });

    this.getProducers();

    let timeout = null;
    this.range.valueChanges.subscribe((value) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (this.range.get('start').value && this.range.get('end').value) {
          this.getCampaigns();
        }
      }, 200);
    });

    this.producerCtrl.valueChanges.subscribe((producer: Producer) => {
      this.getCampaigns();
    });

    this.campaignCtrl.valueChanges.subscribe((value: number) => {
      if (value) {
        this.getCampaignStats();
      }
    });

    this.producerFilteringCtrl.valueChanges.subscribe(value => {
      this.filterProducers(value);
    });
    this.campaignFilteringCtrl.valueChanges.subscribe(value => {
      this._filterCampaigns(value);
    });
  }

  getProducers() {
    if (!this.searchingProducer) {
      this.searchingProducer = true;
      this.http.getProducers().subscribe((result: any) => {
          const producers = result.body.data as Producer[];
          this.searchingProducer = false;
          this.producers = producers;
          this.filteredProducers = producers;
          this.getCampaigns();
        },
        error => {
          this.searchingProducer = false;
        });
    }
    else {
      console.error('Pending request for producers');
    }
  }
  filterProducers(search: string) {
    this.filteredProducers = this.producers.filter((element, index, array) => {
      const value = String(element.name);
      return value.toLowerCase().indexOf(search.toLowerCase()) > -1;
    });
  }

  getCampaigns() {
    if (!this.searchingCampaign) {
      this.searchingCampaign = true;
      const producer = this.producerCtrl.value ? this.producerCtrl.value.id : null;
      const startDate = this._extractDate(this.range.get('start').value);
      const endDate = this._extractDate(this.range.get('end').value);
      this.http.getCampaigns(startDate, endDate, producer).subscribe((result: any) => {
          const campaigns = result.body.data as Campaign[];
          const id = this.campaignCtrl.value;
          this.searchingCampaign = false;
          this.campaigns = campaigns;
          this.filteredCampaigns = campaigns;
          if (id && this._findCampaign(id)) {
            this.getCampaignStats();
          }
          else {
            // this.campaignCtrl.reset();
          }
        },
        error => {
          this.searchingCampaign = false;
        });
    }
    else {
      console.error('Pending request for videos');
    }
  }

  getCampaignStats() {
    if (!this.searchingCampaignStats) {
      this.searchingCampaignStats = true;
      const id = this.campaignCtrl.value;
      const startDate = this._extractDate(this.range.get('start').value);
      const endDate = this._extractDate(this.range.get('end').value);
      this.http.getCampaignStats(id, startDate, endDate).subscribe((result: any) => {
          this.searchingCampaignStats = false;
          this.stats = result.body.data;
          this.chartData.datasets = [
            result.body.data.datasets.total,
            result.body.data.datasets.paid,
            result.body.data.datasets.free,
            result.body.data.datasets.website,
          ];
          this.updateChart();
        },
        error => {
          this.searchingCampaignStats = false;
        });
    }
  }

  toggleCard(index: number) {
    this.cards.forEach((card, i) => {
      if (i !== index) {
        this.cards[i].selected = false;
        this.chartData.datasets[i].hidden = true;
      }
    });
    if (this.cards[index] && this.chartData.datasets[index]) {
      const visible = !this.chartData.datasets[index].hidden;
      if (!visible) {
        this.chartData.datasets[index].hidden = visible;
        this.cards[index].selected = !visible;
        this.chart.chart.update();
      }
    }
  }

  updateChart(selected = 0) {
    this.chartData.datasets.forEach((element, index) => {
      this.chartData.datasets[index].data = element.data;
      this.chartData.datasets[index].label = element.label;
      this.chartData.datasets[index].hidden = !this.cards[index].selected;
    });
    // this.chartData.datasets[selected].hidden = false;
  }

  protected _filterCampaigns(search: string) {
    this.filteredCampaigns = this.campaigns.filter((element, index, array) => {
      const value = String(element.title);
      return value.toLowerCase().indexOf(search.toLowerCase()) > -1;
    });
  }

  protected _extractDate(dateObj?: Date) {
    let date = null;
    if (dateObj) {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      date = `${year}-${month}-${day}`;
    }
    return date;
  }
  protected _findCampaign(id: number) {
    return this.campaigns.findIndex((campaign) => campaign.id === id) !== -1;
  }
}
