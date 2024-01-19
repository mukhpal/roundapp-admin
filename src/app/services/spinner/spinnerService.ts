import { Injectable } from '@angular/core';
import { BlockUIService, BLOCKUI_DEFAULT, BlockUI, NgBlockUI } from 'ng-block-ui';


@Injectable()
export class SpinnerService {
  @BlockUI() blockUI: NgBlockUI;

  start() {
    this.blockUI.start('Loading...');
  }

  stop() {
    this.blockUI.stop();
  }
}
