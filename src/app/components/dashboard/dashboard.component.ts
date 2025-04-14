import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { SalesData, ChartOptions } from '../../models/data.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  salesData: SalesData[] = [];
  loading = true;
  error = false;
  
  chartOptions: ChartOptions = {
    chartType: 'bar',
    groupBy: 'region'
  };
  
  constructor(private dataService: DataService) { }
  
  ngOnInit(): void {
    this.fetchData();
  }
  
  fetchData(): void {
    this.loading = true;
    this.error = false;
    
    this.dataService.getSalesData().subscribe({
      next: (data) => {
        this.salesData = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching data:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }
  
  refreshData(): void {
    this.fetchData();
  }
}