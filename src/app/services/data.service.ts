import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { SalesData } from '../models/data.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // Mock API URL (in a real app, this would be your Spring backend endpoint)
  private apiUrl = 'api/sales';

  constructor(private http: HttpClient) { }

  // In a real application, this would call the actual API
  // Here we're simulating the API call with mock data
  getSalesData(): Observable<SalesData[]> {
    return of(this.generateMockData()).pipe(
      delay(500) // Simulate network delay
    );
  }

  // Generate mock data for demonstration
  private generateMockData(): SalesData[] {
    const regions = ['North', 'South', 'East', 'West'];
    const products = ['Laptop', 'Smartphone', 'Tablet', 'Monitor', 'Keyboard'];
    const categories = ['Electronics', 'Accessories', 'Peripherals'];
    
    const data: SalesData[] = [];
    
    for (let i = 1; i <= 100; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 365));
      
      data.push({
        id: i,
        product: products[Math.floor(Math.random() * products.length)],
        region: regions[Math.floor(Math.random() * regions.length)],
        date: date.toISOString().split('T')[0],
        amount: Math.floor(Math.random() * 1000) + 100,
        units: Math.floor(Math.random() * 20) + 1,
        category: categories[Math.floor(Math.random() * categories.length)]
      });
    }
    
    return data;
  }

  // Group data for charts
  groupDataBy(data: SalesData[], groupBy: string): any[] {
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
}