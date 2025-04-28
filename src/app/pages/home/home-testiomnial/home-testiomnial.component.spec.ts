import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeTestiomnialComponent } from './home-testiomnial.component';

describe('HomeTestiomnialComponent', () => {
  let component: HomeTestiomnialComponent;
  let fixture: ComponentFixture<HomeTestiomnialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeTestiomnialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeTestiomnialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
