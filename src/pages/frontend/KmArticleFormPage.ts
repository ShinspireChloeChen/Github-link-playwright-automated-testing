import { type Page, type Locator } from '@playwright/test';

export interface ArticleFormData {
  title: string; category: string; content: string;
  tags?: string[]; publishDept?: string; expireDate?: string;
}

export class KmArticleFormPage {
  readonly titleInput:   Locator; readonly categorySelect: Locator;
  readonly contentEditor: Locator; readonly expireInput: Locator;
  readonly saveDraftBtn: Locator; readonly submitBtn: Locator;
  readonly articleStatus: Locator; readonly titleError: Locator; readonly contentError: Locator;

  constructor(private page: Page) {
    this.titleInput     = page.getByLabel(/標題|Title/i);
    this.categorySelect = page.getByLabel(/類別|Category/i);
    this.contentEditor  = page.locator('.ql-editor, [contenteditable="true"]').first();
    this.expireInput    = page.getByLabel(/效期|Expire/i);
    this.saveDraftBtn   = page.getByRole('button', { name: /儲存草稿|Save Draft/i });
    this.submitBtn      = page.getByRole('button', { name: /送審|Submit/i });
    this.articleStatus  = page.locator('[data-testid="article-status"]');
    this.titleError     = page.getByText(/標題必填|Title is required/i);
    this.contentError   = page.getByText(/內容必填|Content is required/i);
  }

  async goto() { await this.page.goto('/km/new'); await this.page.waitForLoadState('networkidle'); }

  async fillForm(data: ArticleFormData) {
    if (data.title)    await this.titleInput.fill(data.title);
    if (data.category) { await this.categorySelect.click(); await this.page.getByRole('option', { name: data.category }).click(); }
    if (data.content)  { await this.contentEditor.click(); await this.contentEditor.fill(data.content); }
    if (data.expireDate) await this.expireInput.fill(data.expireDate);
  }

  async saveDraft()       { await this.saveDraftBtn.click(); await this.page.waitForLoadState('networkidle'); }
  async submitForReview() { await this.submitBtn.click();    await this.page.waitForLoadState('networkidle'); }
  async isLoaded()        { return this.titleInput.isVisible(); }
}
