import { Component, ElementRef } from '@angular/core';
import { AppStrings } from 'src/app/shared/app-strings';
import { ApiService } from 'src/app/shared/services/api/api.service';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss'],
})
export class LandingpageComponent {
  defaultPage: string;
  constructor(private elementRef: ElementRef, public apiService: ApiService) {
    this.defaultPage = AppStrings.defaultPage;
  }

  protected scrollToFooter() {
    const targetElement =
      this.elementRef.nativeElement.querySelector('#targetDiv');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  protected Product() {
    const targetElement =
      this.elementRef.nativeElement.querySelector('#targetDiv1');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  protected isAuthenticated() {
    return this.apiService.isUserLoggedIn();
  }
}
