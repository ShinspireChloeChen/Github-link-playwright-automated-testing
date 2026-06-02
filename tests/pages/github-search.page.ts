import { Page, Locator } from '@playwright/test';

/**
 * GitHub 搜尋結果頁面物件
 * 負責與搜尋結果頁面互動的所有操作
 */
export class GitHubSearchPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly filterButton: Locator;
  readonly repositoryResults: Locator;
  readonly repositoryItem: Locator;
  readonly sortDropdown: Locator;
  readonly noResultsMessage: Locator;
  readonly resultCount: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // 搜尋輸入框
    this.searchInput = page.locator('input[type="search"]').first();
    
    // 過濾和排序
    this.filterButton = page.locator('button:has-text("Filters")').first();
    this.sortDropdown = page.locator('[data-testid="sort-select"]');
    
    // 結果相關
    this.repositoryResults = page.locator('[data-testid="results"]');
    this.repositoryItem = page.locator('div[data-testid="result"]');
    this.noResultsMessage = page.locator('text=No results matched your search');
    this.resultCount = page.locator('[data-testid="results-count"]');
  }

  /**
   * 導航到搜尋頁面
   * @param query - 搜尋查詢字符串
   */
  async goto(query: string) {
    await this.page.goto(`/search?q=${encodeURIComponent(query)}`);
  }

  /**
   * 檢查搜尋結果是否載入
   */
  async isLoaded(): Promise<boolean> {
    return await this.repositoryResults.isVisible().catch(() => false);
  }

  /**
   * 取得搜尋結果數量
   */
  async getResultCount(): Promise<number> {
    const resultItems = await this.repositoryItem.count();
    return resultItems;
  }

  /**
   * 檢查是否沒有搜尋結果
   */
  async hasNoResults(): Promise<boolean> {
    return await this.noResultsMessage.isVisible().catch(() => false);
  }

  /**
   * 點擊第一個搜尋結果
   */
  async clickFirstResult() {
    await this.page.test.step('點擊第一個搜尋結果', async () => {
      await this.repositoryItem.first().click();
    });
  }

  /**
   * 取得所有搜尋結果的標題
   */
  async getResultTitles(): Promise<string[]> {
    const titles = await this.repositoryItem.locator('a[data-testid="result-title"]').allTextContents();
    return titles;
  }

  /**
   * 排序搜尋結果
   * @param sortOption - 排序選項 (stars, forks, updated)
   */
  async sortResults(sortOption: 'stars' | 'forks' | 'updated') {
    await this.page.test.step(`排序結果: ${sortOption}`, async () => {
      await this.sortDropdown.click();
      await this.page.locator(`[data-value="${sortOption}"]`).click();
    });
  }

  /**
   * 更新搜尋查詢
   * @param newQuery - 新的搜尋查詢
   */
  async updateSearch(newQuery: string) {
    await this.page.test.step(`更新搜尋: ${newQuery}`, async () => {
      await this.searchInput.clear();
      await this.searchInput.fill(newQuery);
      await this.page.keyboard.press('Enter');
    });
  }

  /**
   * 檢查特定結果是否存在
   * @param repositoryName - 倉庫名稱
   */
  async isResultPresent(repositoryName: string): Promise<boolean> {
    const result = this.page.locator(`text=${repositoryName}`).first();
    return await result.isVisible().catch(() => false);
  }
}
