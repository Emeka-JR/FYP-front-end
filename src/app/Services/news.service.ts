import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { News, NewsCreate, NewsUpdate } from '../models/news.model';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiUrl = `${environment.apiUrl}/news`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  createNews(news: NewsCreate): Observable<News> {
    return this.http.post<News>(this.apiUrl, news, { headers: this.getAuthHeaders() });
  }

  updateNews(id: string, news: NewsUpdate): Observable<News> {
    return this.http.put<News>(`${this.apiUrl}/${id}`, news, { headers: this.getAuthHeaders() });
  }

  deleteNews(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  getNewsById(id: string): Observable<News> {
    return this.http.get<News>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  classifyText(text: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/classify`, { text }, { headers: this.getAuthHeaders() });
  }

  listNews(page: number = 1, limit: number = 10, category?: string, search?: string): Observable<any> {
    let url = `${this.apiUrl}?page=${page}&limit=${limit}`;
    if (category) url += `&category=${category}`;
    if (search) url += `&search=${search}`;
    return this.http.get(url); // No token needed if it's public
  }
}
