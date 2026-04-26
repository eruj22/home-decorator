import { DOCUMENT } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor() {
    this.injectPreconnect();
  }

  private injectPreconnect() {
    const doc = inject(DOCUMENT);
    const link = doc.createElement('link');
    link.rel = 'preconnect';
    link.href = environment.storageUrl;
    doc.head.appendChild(link);
  }
}
