import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';
import { GenericResponse } from 'src/app/shared/models/generic-response';
import { faEraser, faFilter } from '@fortawesome/free-solid-svg-icons';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-mclr-bank-master',
  templateUrl: './mclr-bank-master.component.html',
  styleUrls: ['./mclr-bank-master.component.scss'],
})
export class MclrBankMasterComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'srno',
    'bank_code',
    'bank_name',
    'skey_code',
    'bank_type',
  ];
  mclrBankList = new MatTableDataSource<any>();

  protected selectedCategory: string = 'all';
  protected clearIcon = faEraser;
  protected filterIcon = faFilter;

  protected searchController = new FormControl('');
  protected bankTypeController = new FormControl('all');

  bnkTypes = [
    { value: 'all', viewValue: 'ALL' },
    { value: 'NBANK', viewValue: 'Nationalised Bank' },
    { value: 'PBANK', viewValue: 'Private Bank' },
    { value: 'FBANK', viewValue: 'Foreign Bank' },
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.getAllMclrBankList();
  }

  searchMatch(data: any, searchQuery: string) {
    return (
      data.bank_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      data.bank_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      data.bank_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      data.skey_code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  protected applyFilter() {
    const filterValue = this.searchController.value?.trim().toLowerCase();
    const categoryFilterValue = this.bankTypeController.value
      ?.trim()
      .toLowerCase();
    this.mclrBankList.filterPredicate = (data, _) => {
      const searchMatch = this.searchMatch(data, filterValue ?? '');
      if (categoryFilterValue == 'all') {
        return searchMatch;
      } else {
        const categoryMatch =
          categoryFilterValue === '' ||
          data.skey_code.toLowerCase() ===
            (categoryFilterValue ?? '').toLowerCase();
        return searchMatch && categoryMatch;
      }
    };
    this.mclrBankList.filter = filterValue ?? '';
  }

  protected applyCategoryFilter() {
    let filterValue = this.bankTypeController.value?.trim().toLowerCase();
    if (filterValue === 'all') {
      filterValue = '';
    }
    this.mclrBankList.filterPredicate = (data: any, filter: string) => {
      return (
        filter === '' ||
        data.skey_code.toLowerCase() === filter.trim().toLowerCase()
      );
    };
    this.mclrBankList.filter = filterValue ?? '';
  }

  //Get banklist
  getAllMclrBankList() {
    this.apiService
      .getRequestLegacy<GenericResponse<any>>(
        FeatureList.mclr,
        'getAllMclrBankList'
      )
      .pipe(first())
      .subscribe({
        next: (data) => {
          this.mclrBankList = new MatTableDataSource<any>(data['data']);
          this.mclrBankList.paginator = this.paginator; // Assign paginator here
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }
}
