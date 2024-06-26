import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'src/app/models/shared/button.model';

@Component({
  selector: 'dashboard-card-rel',
  templateUrl: './dashboard-card-rel.component.html',
  styleUrls: ['./dashboard-card-rel.component.scss']
})
export class DashboardCardRelComponent {
  @Input() title!: string;
  @Input() subtitle?: string;
  @Input() buttonArgs?: Button;
  @Input() displayContent = 'block';
  @Input() collapsable: boolean = true;

  @ViewChild('cardContent', { static: true }) contentElement?: ElementRef;
  
  collapsedIcon = faChevronDown;
  expandedIcon = faChevronUp;

  collapseContent() {
    if (!this.collapsable) {
      return;
    }
    if (this.displayContent === 'block') {
      this.displayContent = 'none';
    } else {
      this.displayContent = 'block'; 
    }
  }
}
