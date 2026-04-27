import { provideRouter } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import { AppComponent } from './app.component';

const setup = async () => {
  const result = await render(AppComponent, {
    providers: [provideRouter([])],
  });
  result.detectChanges();
  return result;
};

describe('AppComponent', () => {
  it('should render the site title in the navbar', async () => {
    await setup();

    expect(screen.getByText(/home decorator/i)).toBeDefined();
  });

  it('should render the router outlet', async () => {
    const { container } = await setup();

    expect(container.querySelector('router-outlet')).not.toBeNull();
  });
});
