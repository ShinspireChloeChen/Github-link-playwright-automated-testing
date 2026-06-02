import { Page, Locator } from '@playwright/test';

/**
 * GitHub 主頁面物件
 * 負責與 GitHub 首頁互動的所有操作
 */
export class GitHubHomePage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly signInButton: Locator;
  readonly signUpButton: Locator;
  readonly profileMenu: Locator;
  readonly repositoriesLink: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // 搜尋相關選擇器
    this.searchInput = page.locator('input[placeholder*="search" i]').first();
    this.searchButton = page.locator('button[type="submit"]').first();
    
    // 認證相關選擇器
    this.signInButton = page.locator('a:has-text("Sign in")').first();
    this.signUpButton = page.locator('a:has-text("Sign up")').first();
    
    // 用戶菜單
    this.profileMenu = page.locator('[data-testid="profile-menu-button"]');
    
    // 導航連結
    this.repositoriesLink = page.locator('a:has-text("Repositories")').first();
  }

  /**
   * 導航到 GitHub 主頁
   */
  async goto() {
    await this.page.goto('/');
  }

  /**
   * 執行搜尋操作
   * @param searchTerm - 搜尋關鍵字
   */
  async search(searchTerm: string) {
    await this.page.test.step(`搜尋: ${searchTerm}`, async () => {
      await this.searchInput.fill(searchTerm);
      await this.searchButton.click();
    });
  }

  /**
   * 檢查頁面是否已加載
   */
  async isLoaded(): Promise<boolean> {
    return await this.page.locator('header').isVisible();
  }

  /**
   * 點擊登入按鈕
   */
  async clickSignIn() {
    await this.page.test.step('點擊登入按鈕', async () => {
      await this.signInButton.click();
    });
  }

  /**
   * 點擊註冊按鈕
   */
  async clickSignUp() {
    await this.page.test.step('點擊註冊按鈕', async () => {
      await this.signUpButton.click();
    });
  }

  /**
   * 取得頁面標題
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * 檢查特定元素的可見性
   * @param selector - CSS 選擇器
   */
  async isElementVisible(selector: string): Promise<boolean> {
    return await this.page.locator(selector).isVisible();
  }
}
