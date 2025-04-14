import { Component, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SalesData } from '../../models/data.model';
import { MatFormFieldAppearance } from '@angular/material/form-field';


@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})

export class DataTableComponent implements OnInit, AfterViewInit {
 





  @Input() set data(value: SalesData[]) {
    this._data = value;
    this.dataSource.data = this._data;
  }
  get data(): SalesData[] {
    return this._data;
  }
  
  private _data: SalesData[] = [];
  
  displayedColumns: string[] = ['id', 'product', 'category', 'region', 'date', 'units', 'amount'];
  dataSource = new MatTableDataSource<SalesData>([]);
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor() { }
  
  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}