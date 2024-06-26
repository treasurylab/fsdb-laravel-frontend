import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-block-container',
  templateUrl: './dashboard-block-container.component.html',
  styleUrl: './dashboard-block-container.component.scss',
})
export class DashboardBlockContainerComponent {
  @Input({ required: true }) heading!: string;
  @Input({ required: true }) subHeading!: string;
  @Input() bgColor: string = '#1C326B';
  @Input() icon: string = 'api';
}
