import { type Page, type Locator } from '@playwright/test';

export class KmOverviewPage {
    readonly articleCards: Locator;
    readonly searchInput: Locator;
    readonly addArticleBtn: Locator;
    readonly categoryTabs: Locator;
    readonly myArticlesLink: Locator;
    readonly resetBtn: Locator;
    readonly emptyState: Locator;

  constructor(private page: Page) {
        this.articleCards   = page.locator('[data-testid="article-card"], .km-article-card');
        this.searchInput    = page.getByPlaceholder(/搜尋|Search/i);
        this.addArticleBtn  = page.getByRole('button', { name: /新增文章|New Article/i });
        this.categoryTabs   = page.getByRole('tab');
        this.myArticlesLink = page.getByRole('link', { name: /我的文章|My Articles/i });
        this.resetBtn       = page.getByRole('button', { name: /重設|Reset|全部/i });
        this.emptyState     = page.getByText(/暫無資料|No Data|尚無文章/i);
  }

  // 進入知識庫 — 支持多種路由
  async goto() { 
      // 嘗試新路由
      await this.page.goto('/pages/km-knowledge');
        // 如果重定向到舊路由，接受即可
      await this.page.waitForLoadState('networkidle');
  }

  async search(keyword: string) {
        await this.searchInput.clear();
        await this.searchInput.fill(keyword);
        await this.page.keyboard.press('Enter');
        await this.page.waitForLoadState('networkidle');
  }

  async selectCategoryTab(index: number) {
        await this.categoryTabs.nth(index).click();
        await this.page.waitForLoadState('networkidle');
  }

  async filterByCategory(name: string) {
        await this.page.getByRole('button', { name: /類別篩選|Filter/i }).click();
        await this.page.getByRole('option', { name }).click();
        await this.page.waitForLoadState('networkidle');
  }

  async resetFilter() { 
      await this.resetBtn.click(); 
      await this.page.waitForLoadState('networkidle'); 
  }

  async clickFirstArticle() { 
      await this.articleCards.first().click(); 
  }

  async goToNextPage() { 
      await this.page.getByRole('button', { name: /下一頁|Next/i }).click(); 
      await this.page.waitForLoadState('networkidle'); 
  }

  async isLoaded() { 
      return this.articleCards.first().isVisible(); 
  }
}
