import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNewsFormComponent } from './admin-news-form.component';

describe('AdminNewsFormComponent', () => {
  let component: AdminNewsFormComponent;
  let fixture: ComponentFixture<AdminNewsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminNewsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNewsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
