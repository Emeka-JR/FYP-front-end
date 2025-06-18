import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NewsService } from '../../Services/news.service';
import { News, ClassificationResult } from '../../models/news.model';

@Component({
  selector: 'app-admin-news-form',
  templateUrl: './admin-news-form.component.html',
  styleUrls: ['./admin-news-form.component.css']
})
export class AdminNewsFormComponent implements OnInit {
  newsForm: FormGroup;
  isEditMode = false;
  loading = false;
  error: string | null = null;
  classificationResult: ClassificationResult | null = null;
  classifying = false;

  constructor(
    private fb: FormBuilder,
    private newsService: NewsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.newsForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      content: ['', [Validators.required, Validators.minLength(50)]],
      source: [''],
      tags: [''],
      image_url: ['']
    });

    // Subscribe to content changes
    this.newsForm.get('content')?.valueChanges.subscribe(() => {
      this.onContentChange();
    });
  }

  ngOnInit() {
    const newsId = this.route.snapshot.paramMap.get('id');
    if (newsId) {
      this.isEditMode = true;
      this.loadNews(newsId);
    }
  }

  loadNews(id: string) {
    this.loading = true;
    this.newsService.getNewsById(id).subscribe({
      next: (news) => {
        this.newsForm.patchValue({
          title: news.title,
          content: news.content,
          source: news.source,
          tags: news.tags?.join(', '),
          image_url: news.image_url
        });
        this.classificationResult = { category: news.category, confidence: news.confidence_score || 1 };
      },
      error: (error) => {
        console.error('Error loading news:', error);
        this.error = 'Failed to load news article. Please try again.';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  onContentChange() {
    const content = this.newsForm.get('content')?.value;
    if (content && content.length >= 50) {
      this.classifying = true;
      this.newsService.classifyText(content).subscribe({
        next: (result) => {
          this.classificationResult = result;
          this.error = null;
        },
        error: (error) => {
          console.error('Error classifying content:', error);
          this.error = 'Failed to classify content. You can still save the article.';
          this.classificationResult = null;
        },
        complete: () => {
          this.classifying = false;
        }
      });
    }
  }

  onSubmit() {
    if (this.newsForm.valid) {
      this.loading = true;
      const formData = this.newsForm.value;
      const newsData = {
        ...formData,
        category: this.classificationResult?.category || 'Uncategorized',
        tags: formData.tags ? formData.tags.split(',').map((tag: string) => tag.trim()) : []
      };

      const request = this.isEditMode
        ? this.newsService.updateNews(this.route.snapshot.paramMap.get('id')!, newsData)
        : this.newsService.createNews(newsData);

      request.subscribe({
        next: () => {
          this.router.navigate(['/admin']);
        },
        error: (error) => {
          console.error('Error saving news:', error);
          this.error = 'Failed to save news article. Please try again.';
          this.loading = false;
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/admin']);
  }
}
