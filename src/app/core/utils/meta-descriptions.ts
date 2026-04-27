import { inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';

const descriptions = {
  home: {
    title: 'HomeDecorator — AI Room Design',
    description:
      'Transform any room with AI. Upload a photo of your room, pick a style, and see your space redesigned in seconds. Start designing for free.',
  },
  login: {
    title: 'Login | HomeDecorator',
    description:
      'Login to your HomeDecorator account to access your AI-generated room designs.',
  },
  register: {
    title: 'Create Account | HomeDecorator',
    description:
      'Create a free HomeDecorator account and start transforming your rooms with AI-powered interior design.',
  },
  visualizer: {
    title: 'Room Visualizer | HomeDecorator',
    description:
      'Use the HomeDecorator AI visualizer to redesign your room. Upload a photo, choose a style, and get instant AI-generated room designs.',
  },
};

export const metaDescriptions = (pageType: keyof typeof descriptions) => {
  const title = inject(Title);
  const meta = inject(Meta);

  title.setTitle(descriptions[pageType].title);
  meta.updateTag({
    name: 'description',
    content: descriptions[pageType].description,
  });
  meta.updateTag({ name: 'robots', content: 'index, follow' });
  meta.updateTag({
    property: 'og:url',
    content: environment.siteUrl,
  });
  meta.updateTag({
    property: 'og:title',
    content: descriptions[pageType].title,
  });
  meta.updateTag({
    property: 'og:description',
    content: descriptions[pageType].description,
  });
};
