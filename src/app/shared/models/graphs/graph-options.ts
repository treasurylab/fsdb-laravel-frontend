import { ChartDataset, ChartDatasetCustomTypesPerDataset } from 'chart.js';

export interface GraphOptions {
  labels: string[];
  datasets:
    | ChartDataset<'line', number[]>[]
    | ChartDatasetCustomTypesPerDataset<'line', number[]>[];
  title?: string;
  legend?: 'none' | 'top' | 'bottom' | 'left' | 'right';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  xScale?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  yScale?: any;
}
