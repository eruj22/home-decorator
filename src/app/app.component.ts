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
  private readonly doc = inject(DOCUMENT);

  constructor() {
    this.injectPreconnect();
    this.injectCanonical();
    this.injectMeta();
  }

  private injectPreconnect() {
    const link = this.doc.createElement('link');
    link.rel = 'preconnect';
    link.href = environment.storageUrl;
    this.doc.head.appendChild(link);
  }

  private injectCanonical() {
    const link = this.doc.createElement('link');
    link.rel = 'canonical';
    link.href = environment.siteUrl;
    this.doc.head.appendChild(link);
  }

  private injectMeta() {
    const meta = this.doc.createElement('meta');
    meta.setAttribute('property', 'og:image');
    meta.content = `${environment.storageUrl}/hero.webp`;
    this.doc.head.appendChild(meta);

    const metaUrl = this.doc.createElement('meta');
    metaUrl.setAttribute('property', 'og:url');
    metaUrl.content = environment.siteUrl;
    this.doc.head.appendChild(metaUrl);
  }
}
