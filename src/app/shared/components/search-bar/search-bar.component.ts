import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';

export interface listModel {
  name: string;
  routerLinkString: string;
}
@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent implements OnChanges, OnInit {
  @Input({ required: true }) menuData!: any;
  @ViewChild('searchField', { static: true }) searchField!: ElementRef;
  protected searchString: string = '';
  protected showResultPanel: boolean = false;
  protected isInPanel: boolean = false;
  protected isMac: boolean = false;
  protected menuList!: { name: string; route: string }[];
  protected filterList: { name: string; route: string }[] = [];
  protected currentListIndex: number = -1;

  constructor(private router: Router) {}

  //For Windows
  @HostListener('window:keydown.Control.k', ['$event'])
  onCtrlSlash(e: any) {
    e.preventDefault();
    this.searchField.nativeElement.focus();
  }

  //For Mac
  @HostListener('window:keydown.Meta.k', ['$event'])
  onCommandSlash(e: any) {
    e.preventDefault();
    this.checkOS();
    this.searchField.nativeElement.focus();
  }

  @HostListener('window:keydown.ArrowDown', ['$event'])
  onArrowDown(e: any) {
    e.preventDefault();
    if (this.currentListIndex > this.filterList.length) {
      return;
    }
    this.currentListIndex = this.currentListIndex + 1;
    const listElement = document.getElementById(
      `tile-${this.currentListIndex}`
    );
    if (listElement != null) {
      listElement.focus();
    }
  }

  @HostListener('window:keydown.ArrowUp', ['$event'])
  onArrowUp(e: any) {
    e.preventDefault();
    if (this.currentListIndex <= 0) {
      return;
    }
    this.currentListIndex = this.currentListIndex - 1;
    const listElement = document.getElementById(
      `tile-${this.currentListIndex}`
    );
    if (listElement != null) {
      listElement.focus();
    }
  }

  @HostListener('window:keydown.Enter', ['$event'])
  onEnter(e: any) {
    e.preventDefault();
    const listElement = document.getElementById(
      `tile-${this.currentListIndex}`
    );
    if (listElement == null && this.filterList.length > 0) {
      this.router.navigate([`app/${this.filterList[0].route}`]);
      this.searchString = '';
    }
    if (listElement != null) {
      listElement.click();
    }
  }

  checkOS() {
    const userAgent = window.navigator.userAgent;
    this.isMac = /mac/i.test(userAgent);
  }

  ngOnInit(): void {
    this.checkOS();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['menuData']) {
      this.menuList = this.getLowerLevelMenus(this.menuData);
    }
  }

  setTimeOutClose() {
    setTimeout(() => {
      if (!this.isInPanel) {
        this.searchString = '';
        this.currentListIndex = -1;
        this.showResultPanel = false;
      }
    }, 300);
  }

  getLowerLevelMenus(menuData: any[]): { name: string; route: string }[] {
    const lowerLevelMenus: { name: string; route: string }[] = [];

    function traverseMenu(menuItems: any[]) {
      menuItems.forEach((menuItem) => {
        if (menuItem.children) {
          traverseMenu(menuItem.children);
        } else {
          lowerLevelMenus.push({ name: menuItem.name, route: menuItem.route });
        }
      });
    }

    traverseMenu(menuData);
    return lowerLevelMenus;
  }

  filterByName(name: string) {
    const lowerCaseName = name.toLowerCase();
    return this.menuList.filter((item) =>
      item.name.toLowerCase().includes(lowerCaseName)
    );
  }

  updateMenus() {
    this.filterList = this.filterByName(this.searchString);
    this.currentListIndex = -1;
  }
}
