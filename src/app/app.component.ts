import { Component } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { SpinnerComponent } from './components/spinner/spinner.component';
import {RoutingState} from './services/http/routingState';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @BlockUI() blockUI: NgBlockUI;
  blockTemplate: SpinnerComponent = SpinnerComponent;
  constructor(private routingState: RoutingState) {
    routingState.loadRouting();
  }

}
