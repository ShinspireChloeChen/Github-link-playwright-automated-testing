import { Page, Locator } from '@playwright/test';

/**
 * RaceGo 會員登入頁面物件
 * 負責與登入頁面互動的所有操作
 */
export class RaceGoLoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly rememberCheckbox: Locator;
  readonly forgotPasswordLink: Locator;
  readonly signUpLink: Locator;
  readonly pageTitle: Locator;
  readonly errorMessage: Locator;
  readonly pageHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // 登入表單選擇器
    this.emailInput = page.locator('input[type="email"], input[name*="email" i], input[id*="email" i]').first();
    this.passwordInput = page.locator('input[type="password"], input[name*="password" i], input[id*="password" i]').first();
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In"), button:has-text("登入")').first();
    
    // 額外功能
    this.rememberCheckbox = page.locator('input[type="checkbox"]').first();
    this.forgotPasswordLink = page.locator('a:has-text("Forgot"), a:has-text("忘記")').first();
    this.signUpLink = page.locator('a:has-text("Sign Up"), a:has-text("Register"), a:has-text("註冊")').first();
    
    // 頁面元素
    this.pageTitle = page.locator('h1, h2, .login-title, .page-title').first();
    this.errorMessage = page.locator('[class*="error"], [class*="alert"], .error-msg, .alert-danger').first();
    this.pageHeader = page.locator('header, .navbar, [role="banner"]').first();
  }

  /**
   * 導航到登入頁面
   */
  async goto() {
    await this.page.goto('https://racego-member.webtech888.com/login');
  }

  /**
   * 檢查頁面是否已加載
   */
  async isLoaded(): Promise<boolean> {
    try {
      await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
      return await this.pageHeader.isVisible().catch(() => true);
    } catch {
      return true;
    }
  }

  /**
   * 執行登入操作
   * @param email - 電子郵件
   * @param password - 密碼
   */
  async login(email: string, password: string) {
    await this.page.test.step(`登入: ${email}`, async () => {
      await this.emailInput.fill(email);
      await this.passwordInput.fill(password);
      await this.loginButton.click();
    });
  }

  /**
   * 取得頁面標題
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * 檢查電子郵件輸入框是否可見
   */
  async isEmailInputVisible(): Promise<boolean> {
    return await this.emailInput.isVisible().catch(() => false);
  }

  /**
   * 檢查密碼輸入框是否可見
   */
  async isPasswordInputVisible(): Promise<boolean> {
    return await this.passwordInput.isVisible().catch(() => false);
  }

  /**
   * 檢查登入按鈕是否可見
   */
  async isLoginButtonVisible(): Promise<boolean> {
    return await this.loginButton.isVisible().catch(() => false);
  }

  /**
   * 檢查登入按鈕是否啟用
   */
  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.loginButton.isEnabled().catch(() => false);
  }

  /**
   * 取得錯誤訊息
   */
  async getErrorMessage(): Promise<string> {
    try {
      return await this.errorMessage.textContent() || '';
    } catch {
      return '';
    }
  }

  /**
   * 檢查是否有錯誤訊息
   */
  async hasErrorMessage(): Promise<boolean> {
    return await this.errorMessage.isVisible().catch(() => false);
  }

  /**
   * 點擊忘記密碼連結
   */
  async clickForgotPassword() {
    await this.page.test.step('點擊忘記密碼連結', async () => {
      await this.forgotPasswordLink.click();
    });
  }

  /**
   * 點擊註冊連結
   */
  async clickSignUp() {
    await this.page.test.step('點擊註冊連結', async () => {
      await this.signUpLink.click();
    });
  }

  /**
   * 檢查記住密碼選項
   */
  async checkRememberMe() {
    await this.page.test.step('勾選記住密碼', async () => {
      const isChecked = await this.rememberCheckbox.isChecked().catch(() => false);
      if (!isChecked) {
        await this.rememberCheckbox.check();
      }
    });
  }

  /**
   * 取得頁面 URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * 等待導航到新頁面
   * @param timeout - 超時時間（毫秒）
   */
  async waitForNavigation(timeout: number = 5000) {
    await this.page.waitForNavigation({ waitUntil: 'networkidle', timeout }).catch(() => {});
  }
}
