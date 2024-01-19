import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject} from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SpinnerService } from '../spinner/spinnerService';
import {concatMap, tap} from 'rxjs/operators';
import {Campaign} from '../../models/campaign';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private baseUrl = environment.urlBase;
  private url = environment.urlBase;

  public title = 'RoundApp';

  constructor(private router: Router, private http: HttpClient, private spinner: SpinnerService) { }

  private resolveRoute(route: string) {
    const pattern = /^http[s]?:\/\//i;
    const absolute = route.match(pattern) !== null;
    return absolute ? route : this.baseUrl + route;
  }


  get(route: string, extraOptions?: any) {
    const defaultOptions = {
      observe: 'response' as const
    };
    const options = {...defaultOptions, ...extraOptions};
    const url = this.resolveRoute(route);
    return this.http.get(url, options);
  }

  post(route: string, body?: any, extraOptions?: any) {
    const defaultOptions = {
      observe: 'response' as const
    };
    const options = {...defaultOptions, ...extraOptions};
    const url = this.resolveRoute(route);
    return this.http.post(url, body, options);
  }

  put(route: string, body?: any, extraOptions?: any) {
    const defaultOptions = {
      observe: 'response' as const
    };
    const options = {...defaultOptions, ...extraOptions};
    const url = this.resolveRoute(route);
    return this.http.put(url, body, options);
  }

  patch(route: string, body?: any, extraOptions?: any) {
    const defaultOptions = {
      observe: 'response' as const
    };
    const options = {...defaultOptions, ...extraOptions};
    const url = this.resolveRoute(route);
    return this.http.patch(url, body, options);
  }

  delete(route: string, extraOptions?: any) {
    const defaultOptions = {
      observe: 'response' as const
    };
    const options = {...defaultOptions, ...extraOptions};
    const url = this.resolveRoute(route);
    return this.http.delete(url, options);
  }

  getCounters() {
    const params = { };
    const headers = new HttpHeaders({'X-Spinner': '0'});
    return this.get(`campaigns/counters`, { params, headers });
  }

  getDashboard() {
    const params = { };
    const headers = new HttpHeaders({'X-Spinner': '1'});
    return this.get(`campaigns/dash`, { params, headers });
  }
/*
  User(model: any) {
    return this.put(`adv/${model.id}`, model);
  }
  */

  getAdvertisers() {
    return this.get(`adv`);
  }

  getAdvertiserMe() {
    return this.get(`adv/me`);
  }


  updateAdvertiserMe(model: any) {
    return this.put(`adv/me`, model);
  }

  getCampaigns(startDate?: string, endDate?: string, producer?: number) {
    const params: any = { };
    if (startDate) {
      params.startDate = startDate;
    }
    if (endDate) {
      params.endDate = endDate;
    }
    if (producer) {
      Object.assign(params, { producer });
    }
    const headers = new HttpHeaders({'X-Spinner': '0'});
    return this.get(`campaigns`, { params, headers });
  }

  addCampaign(model: Campaign) {
    return this.post(`campaigns`, model);
  }

  getCampaign(id?: number) {
    if (id) {
      return this.get(`campaigns/${id}`);
    }
    else {
      return this.get(`campaigns/info`);
    }
  }

  getCampaignStats(id: number, startDate: string, endDate: string) {
    const params = { startDate, endDate};
    const headers = new HttpHeaders({'X-Spinner': '1'});
    return this.get(`campaigns/${id}/stats`, { params, headers });
  }

  updateCampaign(model: Campaign) {
    return this.put(`campaigns/${model.id}`, model);
  }

  deleteCampaign(id: number) {
    return this.delete(`campaigns/${id}`);
  }

  getProducers(query?: string) {
    const headers = new HttpHeaders({'X-Spinner': '1'});
    return this.get(`producers`, { headers });
  }

  deleteFile(type: string, uuid: string) {
    return this.delete(`files/${type}/delete/${uuid}`);
  }

  /* PAYMENTS */

  payin() {

  }

  registerCard() {
    const headers = new HttpHeaders({
      'X-Spinner': '1'
    });
    return this.post(`payment/register-card`, {}, { headers });
  }

  sendCardInfo(cardRegistration: any, cardData: any) {
    const url = cardRegistration.url;
    const body = new URLSearchParams();
    body.set('accessKeyRef', cardRegistration.accessKeyRef);
    body.set('data', cardRegistration.data);
    body.set('cardNumber', cardData.number);
    body.set('cardExpirationDate', cardData.expirationDate);
    body.set('cardCvx', cardData.cvx);
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
      responseType: 'text'
    };
    return this.post(url, body.toString(), options);
  }

  confirmCard(uuid: string, data: string) {
    console.log(data);
    return this.post(`payment/confirm-card/${uuid}`, { data });
  }
}

