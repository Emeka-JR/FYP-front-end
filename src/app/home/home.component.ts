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
  searchText = '';
  filterCategory = '';
  categories: string[] = [];

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadNews();
  }

  loadCategories(): void {
    // This is a simple way to get categories from the news list. In a real app, you might have a categories endpoint.
    this.newsService.listNews(1, 100).subscribe({
      next: (response) => {
        const allCategories = response.items.map((item: News) => item.category).filter(Boolean);
        this.categories = Array.from(new Set(allCategories));
      },
      error: () => {
        this.categories = [];
      }
    });
  }

  loadNews(page: number = 1): void {
    this.loading = true;
    this.error = null;
    this.newsService.listNews(page, this.pageSize, this.filterCategory || undefined, this.searchText || undefined).subscribe({
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

  onSearch(search: string) {
    this.searchText = search;
    this.currentPage = 1;
    this.loadNews(1);
  }

  onFilterCategory(category: string) {
    this.filterCategory = category;
    this.currentPage = 1;
    this.loadNews(1);
  }

  get totalPages(): number {
    return Math.ceil(this.totalNews / this.pageSize);
  }
}
