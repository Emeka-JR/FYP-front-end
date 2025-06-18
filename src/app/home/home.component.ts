import { Component, OnInit } from '@angular/core';
import { NewsService } from '../Services/news.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  featuredNews: any[] = [];
  latestNews: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(): void {
    this.loading = true;
    this.error = null;

    // Load featured news (most viewed)
    this.newsService.listNews().subscribe({
      next: (response) => {
        this.featuredNews = response.items;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load featured news';
        this.loading = false;
        console.error('Error loading featured news:', error);
      }
    });

    // Load latest news
    this.newsService.listNews().subscribe({
      next: (response) => {
        this.latestNews = response.items;
      },
      error: (error) => {
        console.error('Error loading latest news:', error);
      }
    });
  }
}
