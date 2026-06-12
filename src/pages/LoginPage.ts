import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton:   Locator;

  constructor(private page: Page) {
    this.usernameInput = page.getByLabel(/帳號|Username/i);
    this.passwordInput = page.getByLabel(/密碼|Password/i);
    this.loginButton   = page.getByRole('button', { name: /登入|Login/i });
  }

  async goto(baseUrl: string) { await this.page.goto(`${baseUrl}/login`); }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
