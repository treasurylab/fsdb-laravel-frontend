import { Component, Input } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { ApiService } from 'src/app/shared/services/api/api.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent {
  @Input({ required: true }) userInitials!: string;
  @Input({ required: true }) userName!: string;
  @Input() company: string = 'Fourth Signal';

  constructor(private authService: AuthService) {}

  protected showActionsPanel: boolean = false;
  protected isInActionsPanel: boolean = false;

  setTimeOutClose() {
    setTimeout(() => {
      if (!this.isInActionsPanel) {
        this.showActionsPanel = false;
      }
    }, 300);
  }

  logout() {
    this.authService.logout();
  }
}
