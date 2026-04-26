import { provideRouter, Router } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { HomeComponent } from './home.component';

const setup = async () => {
  const result = await render(HomeComponent, {
    providers: [
      provideRouter([{ path: 'visualizer', component: HomeComponent }]),
    ],
  });
  result.detectChanges();
  return result;
};

describe('HomeComponent', () => {
  it('should render the hero heading', async () => {
    await setup();

    expect(
      screen.getByRole('heading', { name: /design your room with ai/i }),
    ).toBeDefined();
  });

  it('should navigate to the visualizer page on CTA button click', async () => {
    const { fixture } = await setup();
    const router = fixture.debugElement.injector.get(Router);

    await userEvent.click(
      screen.getByRole('button', { name: /start designing for free/i }),
    );

    expect(router.url).toBe('/visualizer');
  });

  it('should render the three feature sections', async () => {
    await setup();

    expect(screen.getByText(/upload image/i)).toBeDefined();
    expect(screen.getByText(/select style/i)).toBeDefined();
    expect(screen.getByText(/watch the magic/i)).toBeDefined();
  });
});
