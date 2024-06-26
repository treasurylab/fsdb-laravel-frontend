import { Component } from '@angular/core';
import {
  faEye,
  faPenToSquare,
  faTrash,
  faRefresh,
  faCloudArrowDown,
  faMagnifyingGlass,
  faEraser,
} from '@fortawesome/free-solid-svg-icons';
import { GraphOptions } from 'src/app/shared/models/graphs/graph-options';

@Component({
  selector: 'app-widget-demo',
  templateUrl: './widget-demo.component.html',
  styleUrl: './widget-demo.component.scss',
})
export class WidgetDemoComponent {
  protected editIcon = faPenToSquare;
  protected deleteIcon = faTrash;
  protected exportIcon = faCloudArrowDown;
  protected searchIcon = faMagnifyingGlass;
  protected clearIcon = faEraser;
  protected viewIcon = faEye;
  protected refreshIcon = faRefresh;

  protected buttonInfo = {
    title: 'Button',
    content: 'This section contains different types of buttons in FsDataBridge',
  };

  protected selectOptions = [
    {
      id: 1,
      name: 'Example 1',
    },
    {
      id: 2,
      name: 'Example 2',
    },
    {
      id: 3,
      name: 'Example 3',
    },
  ];

  protected graphLabels = ['1', '2', '3', '4', '5'];
  protected graphData = [
    {
      label: 'Element 1',
      data: [10, 15, 25, 5, 30],
      backgroundColor: '#1C326B',
      borderColor: '#1C326B',
      borderWidth: 2,
      fill: 'true',
    },
    {
      label: 'Element 2',
      data: [8, 21, 7, 16, 18],
      backgroundColor: '#1C326B',
      borderColor: '#1C326B',
      borderWidth: 2,
      fill: 'true',
    },
    {
      label: 'Element 3',
      data: [10, 14, 20, 19, 15],
      backgroundColor: '#1C326B',
      borderColor: '#1C326B',
      borderWidth: 2,
      fill: 'true',
    },
  ];
  protected chartOptions: GraphOptions = {
    labels: this.graphLabels,
    datasets: this.graphData,
    title: 'Demo Chart',
    legend: 'bottom',
  };
}
