import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate, query, group } from '@angular/animations';

@Component({
  selector: 'app-home-hero',
  imports: [RouterModule],
  templateUrl: './home-hero.component.html',
  styleUrl: './home-hero.component.scss',
  animations: [
    trigger('slideInFromSides', [
      transition(':enter', [
        group([
          query('.text-container', [
            style({ opacity: 0, transform: 'translateX(-80%)' }),
            animate('1s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
          ]),
          query('.image-container', [
            style({ opacity: 0, transform: 'translateX(50%)' }),
            animate('1s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
          ])
        ])
      ])
    ])
  ]
})
export class HomeHeroComponent {}