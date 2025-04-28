import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeProcessComponent } from './home-process.component';

describe('HomeProcessComponent', () => {
  let component: HomeProcessComponent;
  let fixture: ComponentFixture<HomeProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeProcessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
