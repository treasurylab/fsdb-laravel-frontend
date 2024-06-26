import { Component, Input } from '@angular/core';
import { Button } from 'src/app/models/shared/button.model';

@Component({
  selector: 'dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.scss']
})
export class DashboardCardComponent {
  @Input() title!: string;
  @Input() subtitle?: string;
  @Input() buttonArgs?: Button;
}
