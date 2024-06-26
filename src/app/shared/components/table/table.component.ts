import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements AfterViewInit {
  protected filterIcon = faFilter;

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  showDropdown = false;
  selectedSortOption: 'newest' | 'oldest' = 'newest';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('dropdown') dropdown!: ElementRef;

  constructor(private eRef: ElementRef) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  isNumeric(value: any): boolean {
    return !isNaN(value);
  }

  showPaginator(): boolean {
    return this.dataSource.data.length > 10;
  }
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  applySorting() {
    if (this.selectedSortOption === 'newest') {
      this.dataSource.data.sort((a, b) => a.position - b.position);
    } else if (this.selectedSortOption === 'oldest') {
      this.dataSource.data.sort((a, b) => b.position - a.position);
    }
    this.dataSource = new MatTableDataSource<PeriodicElement>(
      this.dataSource.data
    );
    this.showDropdown = false;
  }

  closeDropdown(event: any) {
    if (
      this.showDropdown &&
      event &&
      !this.dropdown.nativeElement.contains(event.target)
    ) {
      this.showDropdown = false;
    }
  }
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: any[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  { position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na' },
  { position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg' },
  { position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al' },
  { position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si' },
  { position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P' },
  { position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S' },
  { position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl' },
  { position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar' },
  { position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K' },
  { position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca' },
];
