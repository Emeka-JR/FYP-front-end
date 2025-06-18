import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../Services/news.service';
import { News } from '../../models/news.model';

@Component({
  selector: 'app-admin-news-list',
  templateUrl: './admin-news-list.component.html',
  styleUrls: ['./admin-news-list.component.css']
})
export class AdminNewsListComponent implements OnInit {
  news: News[] = [];
  loading = false;
  error: string | null = null;
  searchQuery = '';
  selectedCategory: string | undefined = undefined;
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  categories = [
    'Academics',
    'Events',
    'Sports',
    'Technology and Innovation',
    'Chaplaincy',
    'Opportunities'
  ];
  Math = Math; // Make Math available in template
  showDeleteConfirm = false;
  newsToDelete: News | null = null;

  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.loadNews();
  }

  loadNews() {
    this.loading = true;
    this.error = null;
    const skip = (this.currentPage - 1) * this.pageSize;
    
    this.newsService.listNews()
      .subscribe({
        next: (response) => {
          this.news = response.items;
          this.totalItems = response.total;
        },
        error: (error) => {
          console.error('Error loading news:', error);
          this.error = 'Failed to load news articles. Please try again later.';
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  onSearch() {
    this.currentPage = 1;
    this.loadNews();
  }

  onCategoryChange() {
    this.currentPage = 1;
    this.loadNews();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadNews();
  }

  onDelete(news: News) {
    this.newsToDelete = news;
    this.showDeleteConfirm = true;
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.newsToDelete = null;
  }

  confirmDelete() {
    if (!this.newsToDelete) return;
    
    this.newsService.deleteNews(this.newsToDelete.id).subscribe({
      next: () => {
        this.showDeleteConfirm = false;
        this.newsToDelete = null;
        this.loadNews();
      },
      error: (error: any) => {
        console.error('Error deleting news:', error);
        if (error.error?.detail) {
          this.error = error.error.detail;
        } else if (error.error?.message) {
          this.error = error.error.message;
        } else {
          this.error = 'Failed to delete news article. Please try again later.';
        }
        this.showDeleteConfirm = false;
        this.newsToDelete = null;
      }
    });
  }
} 