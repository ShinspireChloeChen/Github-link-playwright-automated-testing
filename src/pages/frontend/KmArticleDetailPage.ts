import { type Page, type Locator } from '@playwright/test';

export class KmArticleDetailPage {
  readonly title: Locator; readonly content: Locator; readonly category: Locator;
  readonly author: Locator; readonly status: Locator; readonly favoriteBtn: Locator;
  readonly editBtn: Locator; readonly deleteBtn: Locator; readonly backBtn: Locator;
  readonly commentInput: Locator; readonly postCommentBtn: Locator;

  constructor(private page: Page) {
    this.title        = page.locator('h1, [data-testid="article-title"]');
    this.content      = page.locator('[data-testid="article-content"], .article-body');
    this.category     = page.locator('[data-testid="article-category"]');
    this.author       = page.locator('[data-testid="article-author"]');
    this.status       = page.locator('[data-testid="article-status"]');
    this.favoriteBtn  = page.getByRole('button', { name: /收藏|Favorite/i });
    this.editBtn      = page.getByRole('button', { name: /編輯|Edit/i });
    this.deleteBtn    = page.getByRole('button', { name: /刪除|Delete/i });
    this.backBtn      = page.getByRole('button', { name: /返回|Back/i });
    this.commentInput = page.getByPlaceholder(/輸入留言|Add comment/i);
    this.postCommentBtn = page.getByRole('button', { name: /送出留言|Post/i });
  }

  async goto(id: string) { await this.page.goto('/km/' + id); await this.page.waitForLoadState('networkidle'); }
  async clickDelete() { await this.deleteBtn.click(); }
  async confirmDelete() { await this.page.getByRole('button', { name: /確認刪除|Confirm/i }).click(); await this.page.waitForLoadState('networkidle'); }
  async cancelDelete() { await this.page.getByRole('button', { name: /取消|Cancel/i }).click(); }
  async toggleFavorite() { await this.favoriteBtn.click(); }
  async isFavorited() { return (await this.favoriteBtn.getAttribute('aria-pressed')) === 'true'; }
  async goBack() { await this.backBtn.click(); }
  async postComment(c: string) { await this.commentInput.fill(c); await this.postCommentBtn.click(); await this.page.waitForLoadState('networkidle'); }
  async isLoaded() { return this.title.isVisible(); }
}
