import { Component, OnInit } from '@angular/core';
import { NewsService } from '../Services/news.service';
import { News } from '../models/news.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  newsList: News[] = [];
  loading = false;
  error: string | null = null;
  currentPage = 1;
  pageSize = 6;
  totalNews = 0;

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(page: number = 1): void {
    this.loading = true;
    this.error = null;
    this.newsService.listNews(page, this.pageSize).subscribe({
      next: (response) => {
        this.newsList = response.items;
        this.totalNews = response.total;
        this.currentPage = page;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load news';
        this.loading = false;
        console.error('Error loading news:', error);
      }
    });
  }

  onPageChange(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.loadNews(page);
  }

  get totalPages(): number {
    return Math.ceil(this.totalNews / this.pageSize);
  }
}
