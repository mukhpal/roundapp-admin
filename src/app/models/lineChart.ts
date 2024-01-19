import {Color, Label} from 'ng2-charts';
import {ChartDataSets} from 'chart.js';

export interface LineChart {
  datasets: ChartDataSets[];
  labels: Label[];
  colors: Color[];
  options: any;
}
