export interface SalesData {
    id: number;
    product: string;
    region: string;
    date: string;
    amount: number;
    units: number;
    category: string;
  }
  
  export interface ChartOptions {
    chartType: string;
    groupBy: string;
  }