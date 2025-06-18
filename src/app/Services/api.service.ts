import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8000';  // FastAPI default port

  constructor(private http: HttpClient) { }

  // Get news articles
  getNews(): Observable<any> {
    return this.http.get(`${this.baseUrl}/news`);
  }

  // Get a single news article
  getNewsById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/news/${id}`);
  }

  // Add a new news article
  addNews(news: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/news`, news);
  }

  // Update a news article
  updateNews(id: string, news: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/news/${id}`, news);
  }

  // Delete a news article
  deleteNews(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/news/${id}`);
  }
} 