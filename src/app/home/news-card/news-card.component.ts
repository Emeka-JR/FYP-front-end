import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
// import { News } from '../../Model/news';
import { News } from '../../models/news.model';

@Component({
  selector: 'app-news-card',

  templateUrl: './news-card.component.html',
  styleUrl: './news-card.component.css'
})
export class NewsCardComponent {

  @Input()
  news!: News;

  constructor(private router: Router) {}

  onView() {
    this.router.navigate(['/news', this.news.id]);
  }
   readMore() {
    this.router.navigate(['/news', this.news.id]); // ✅ Use 'id' not '_id'
  }
}
