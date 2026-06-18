import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async login(username: string, password: string) {
    await this.page.goto('/login');
    await this.page.fill('input[name="account"]', username);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('button[type="submit"]');
    await this.page.waitForURL(url => !url.toString().includes('/login'), { timeout: 15000 });
  }
}
