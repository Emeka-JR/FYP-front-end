import { Component, OnInit } from '@angular/core';
import { NewsService } from '../Services/news.service';

@Component({
  selector: 'app-test-connection',
  template: `
    <div class="test-container">
      <h2>Backend Connection Test</h2>
      
      <div *ngIf="loading" class="loading">
        Testing connection...
      </div>
      
      <div *ngIf="error" class="error">
        Error: {{ error }}
      </div>
      
      <div *ngIf="success" class="success">
        Successfully connected to backend!
      </div>
      
      <button (click)="testConnection()" [disabled]="loading">
        Test Connection
      </button>
    </div>
  `,
  styles: [`
    .test-container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .loading {
      color: #666;
      margin: 10px 0;
    }
    
    .error {
      color: #dc3545;
      margin: 10px 0;
      padding: 10px;
      background-color: #f8d7da;
      border-radius: 4px;
    }
    
    .success {
      color: #28a745;
      margin: 10px 0;
      padding: 10px;
      background-color: #d4edda;
      border-radius: 4px;
    }
    
    button {
      padding: 10px 20px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  `]
})
export class TestConnectionComponent implements OnInit {
  loading = false;
  error: string | null = null;
  success = false;

  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.testConnection();
  }

  testConnection() {
    this.loading = true;
    this.error = null;
    this.success = false;

    this.newsService.getNewsList(0, 1).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
      },
      error: (err) => {
        this.loading = false;
        this.error = err.message || 'Failed to connect to backend';
      }
    });
  }
} 