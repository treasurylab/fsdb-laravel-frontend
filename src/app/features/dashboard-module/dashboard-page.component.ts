import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectorRef } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';
import { AppUser } from 'src/app/shared/models/app-user';
import { faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import {
  MenuItem,
  convertDataToModel,
} from 'src/app/models/dashboard/menu-item.model';
import { LocalStorageStrings } from 'src/app/shared/local-storage-strings';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: 'dashboard-page.component.html',
  styleUrls: ['dashboard-page.component.scss'],
})
export class DashboardPageComponent implements OnInit, AfterViewInit {
  public Object = Object;
  @ViewChild(MatSidenav) sideNav!: MatSidenav;
  constructor(
    private observer: BreakpointObserver,
    private apiService: ApiService,
    private cdRef: ChangeDetectorRef,
    private router: Router
  ) {}

  //Variables
  protected userName = 'Anonymous';
  protected userNameInitials = 'A';
  protected companyName = 'Unavailable';

  protected menus = new Array<MenuItem>();
  protected toggleMenu = false;
  protected userDetails?: AppUser;
  protected moneyIcon = faMoneyBill;
  protected isCollapsed = false;
  protected showCollapseIcon = false;
  protected isInSidenav = false;
  protected mainCollapsed = this.isCollapsed;
  private collapsedString = 'sidenavCollapsed';

  ngOnInit(): void {
    this.getSidebarMenus();
    this.initSidebar();
  }

  ngAfterViewInit() {
    var firstName = localStorage.getItem(LocalStorageStrings.firstName);
    var lastName = localStorage.getItem(LocalStorageStrings.lastName);
    var title = localStorage.getItem(LocalStorageStrings.title);
    this.companyName =
      localStorage.getItem(LocalStorageStrings.userCompany) ?? 'Unavailable';
    this.userName = `${title} ${firstName} ${lastName}`;

    this.userNameInitials = `${
      firstName == null || firstName === '' ? '' : firstName[0]
    }${lastName === null || lastName === '' ? '' : lastName[0]}`;

    //TODO: OPEN IN INTEREST RATES OVERVIEW BY DEFAULT
    // this.setDefaultLandingPage(localStorage.getItem('landing_menucode') ?? '');
    this.observer.observe(['(max-width:1024px)']).subscribe((res) => {
      if (res.matches) {
        this.sideNav.mode = 'over';
        this.sideNav.close();
      } else {
        this.sideNav.mode = 'side';
        this.sideNav.open();
      }
    });
    this.cdRef.detectChanges();
  }

  protected menuToggle() {
    this.toggleMenu = !this.toggleMenu;
  }

  protected clickToggle() {
    if (this.sideNav.mode == 'over') {
      this.sideNav.close();
    }
  }

  private getSidebarMenus() {
    //Function to get menus
    this.apiService
      .getRequest('dashboard-menus')
      .pipe(first())
      .subscribe({
        next: (response: any) => {
          this.menus = convertDataToModel(response['data']);
        },
      });
    return;
  }

  private initSidebar() {
    var sidebarState = localStorage.getItem(this.collapsedString);
    if (sidebarState !== null) {
      if (sidebarState === 'true') {
        this.mainCollapsed = true;
        this.isCollapsed = true;
        return;
      }
      if (sidebarState === 'false') {
        this.mainCollapsed = false;
        this.isCollapsed = false;
      }
    }
  }

  private setDefaultLandingPage(route: string) {
    //Deprecated Function, if still exists by July 1 delete.
    const defaultRoute = this.router.config?.[3].children?.[0];
    const isSet = localStorage.getItem('isset');
    if (!isSet && defaultRoute) {
      defaultRoute.redirectTo = route;
      this.router.navigate(['/app/' + route]);
      localStorage.setItem('isset', 'true');
    }
  }

  protected handleSidenavCollapsing(shouldCollapse: boolean) {
    if (shouldCollapse) {
      localStorage.setItem(this.collapsedString, 'true');
    }
    if (!shouldCollapse) {
      localStorage.setItem(this.collapsedString, 'false');
    }

    this.mainCollapsed = shouldCollapse;
  }

  protected handleCollapsing(type: string) {
    if (this.mainCollapsed) {
      if (type == 'enter') {
        this.isCollapsed = false;
      }
      if (type == 'leave') {
        this.isCollapsed = true;
      }
    }
  }
  handleShowIcon(state: boolean) {
    const hoverElement = document.getElementById('hover-wrapper');
    if (hoverElement) {
      if (state) {
        hoverElement.style.borderStyle = 'none none none solid';
      } else {
        hoverElement.style.borderStyle = 'none';
      }
    }

    this.showCollapseIcon = state;
  }
}
