import { MatTableDataSource } from '@angular/material/table';
import { first } from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { FeatureList } from 'src/features';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-sdl-fbil-mappinglist',
  templateUrl: './sdl-fbil-mappinglist.component.html',
  styleUrls: ['./sdl-fbil-mappinglist.component.scss'],
})
export class SdlFbilMappinglistComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  mappeddata!: any[]; // Add the definite assignment assertion here
  dataSource: MatTableDataSource<any>;

  @ViewChild('filterField') filterField: any;

  constructor(private apiService: ApiService) {
    this.dataSource = new MatTableDataSource();
  }

  displayedColumns: string[] = ['no', 'Class Id', 'ISIN'];

  ngOnInit(): void {
    this.mappedClassId();
  }

  mappedClassId() {
    this.apiService
      .getRequestLegacy(FeatureList.fbilmapping, 'sdlMappedClassIdList')
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.mappeddata = data['data'];
          this.dataSource.data = this.mappeddata;
          this.dataSource!.paginator = this.paginator;
        },
        error: (err: any) => {
          console.error(err);
        },
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
