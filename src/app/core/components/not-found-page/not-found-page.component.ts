import { Component } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api/api.service';

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.component.html',
})
export class NotFoundPageComponent {
  constructor(private apiService: ApiService) {}

  protected logout() {
    this.apiService.logout();
  }
}
