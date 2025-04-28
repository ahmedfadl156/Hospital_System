import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { HomeNavComponent } from './home-nav/home-nav.component';
import { HomeHeroComponent } from './home-hero/home-hero.component';
import { HomeAboutComponent } from './home-about/home-about.component';
import { HomeProcessComponent } from './home-process/home-process.component';
import { HomeTestiomnialComponent } from './home-testiomnial/home-testiomnial.component';
import { HomeFooterComponent } from './home-footer/home-footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HomeNavComponent, HomeHeroComponent, HomeAboutComponent, HomeProcessComponent, HomeTestiomnialComponent, HomeFooterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('50s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('50s ease-out', style({ transform: 'translateX(0)' }))
      ])
    ]),
    trigger('staggerIn', [
      transition(':enter', [
        query('.stagger-item', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('0.1s', [
            animate('50s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ])
      ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('0.5s ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
