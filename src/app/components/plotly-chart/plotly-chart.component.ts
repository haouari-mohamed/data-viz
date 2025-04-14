import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SalesData, ChartOptions } from '../../models/data.model';


@Component({
  selector: 'app-plotly-chart',
  templateUrl: './plotly-chart.component.html',
  styleUrls: ['./plotly-chart.component.scss']
})
export class PlotlyChartComponent implements OnChanges {
  @Input() data: SalesData[] = [];
  @Input() options: ChartOptions = { chartType: 'bar', groupBy: 'region' };
  
  public graph: any = {};
  public layout: any = {};
  
  constructor() { }
  
  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['data'] && this.data) || changes['options']) {
      this.updateChart();
    }
  }
  
  updateChart(): void {
    if (!this.data || this.data.length === 0) return;
    
    // Process the data based on groupBy option
    let processedData: any[] = [];
    
    switch(this.options.chartType) {
      case 'bar':
        processedData = this.prepareBarChart();
        break;
      case 'pie':
        processedData = this.preparePieChart();
        break;
      case 'line':
        processedData = this.prepareLineChart();
        break;
      default:
        processedData = this.prepareBarChart();
    }
    
    this.graph = {
      data: processedData,
      layout: this.layout
    };
  }
  
  prepareBarChart(): any[] {
    const groupedData = this.groupDataBy(this.data, this.options.groupBy);
    
    // Prepare layout
    this.layout = {
      title: `Sales by ${this.options.groupBy}`,
      xaxis: {
        title: this.capitalizeFirstLetter(this.options.groupBy)
      },
      yaxis: {
        title: 'Amount'
      }
    };
    
    return [{
      x: groupedData.map(item => item.name),
      y: groupedData.map(item => item.totalAmount),
      type: 'bar',
      marker: {
        color: 'rgba(55, 128, 191, 0.7)'
      }
    }];
  }
  
  preparePieChart(): any[] {
    const groupedData = this.groupDataBy(this.data, this.options.groupBy);
    
    // Prepare layout
    this.layout = {
      title: `Sales Distribution by ${this.options.groupBy}`
    };
    
    return [{
      values: groupedData.map(item => item.totalAmount),
      labels: groupedData.map(item => item.name),
      type: 'pie'
    }];
  }
  
  prepareLineChart(): any[] {
    // Group by date first
    let dateMap = new Map();
    
    this.data.forEach(item => {
      const date = item.date;
      if (!dateMap.has(date)) {
        dateMap.set(date, { date, amount: 0 });
      }
      dateMap.get(date).amount += item.amount;
    });
    
    // Sort dates
    const sortedData = Array.from(dateMap.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Prepare layout
    this.layout = {
      title: 'Sales Trend Over Time',
      xaxis: {
        title: 'Date'
      },
      yaxis: {
        title: 'Amount'
      }
    };
    
    return [{
      x: sortedData.map(item => item.date),
      y: sortedData.map(item => item.amount),
      type: 'scatter',
      mode: 'lines+markers',
      marker: {
        color: 'rgba(55, 128, 191, 0.7)'
      }
    }];
  }
  
  // Helper function to group data
  private groupDataBy(data: SalesData[], groupBy: string): any[] {
    const grouped = data.reduce((acc, curr) => {
      const key = curr[groupBy as keyof SalesData];
      if (!acc[key]) {
        acc[key] = {
          name: key,
          totalAmount: 0,
          totalUnits: 0,
          count: 0
        };
      }
      acc[key].totalAmount += curr.amount;
      acc[key].totalUnits += curr.units;
      acc[key].count += 1;
      return acc;
    }, {} as Record<string, any>);
    
    return Object.values(grouped);
  }
  
  private capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}