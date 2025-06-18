import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NewsService } from '../Services/news.service';
import { News, NewsResponse } from '../models/news.model';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  articles: News[] = [];

  constructor(
    private newsService: NewsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadArticles();
  }

  loadArticles() {
    this.newsService.listNews().subscribe({
      next: (response: NewsResponse) => {
        this.articles = response.items;
      },
      error: (error) => {
        console.error('Error loading articles:', error);
      }
    });
  }

  createNewArticle() {
    this.router.navigate(['/admin/news/create']);
  }

  editArticle(article: News) {
    this.router.navigate(['/admin/news/edit', article.id]);
  }

  deleteArticle(article: News) {
    if (confirm('Are you sure you want to delete this article?')) {
      this.newsService.deleteNews(article.id).subscribe({
        next: () => {
          this.articles = this.articles.filter(a => a.id !== article.id);
        },
        error: (error) => {
          console.error('Error deleting article:', error);
        }
      });
    }
  }
}
