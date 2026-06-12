import { type Page, type Locator } from '@playwright/test';

export class KmbCategoryPage {
  readonly heading:       Locator;
  readonly categoryRows:  Locator;
  readonly addCategoryBtn:Locator;
  readonly nameInput:     Locator;
  readonly saveBtn:       Locator;
  readonly nameError:     Locator;
  readonly duplicateError:Locator;

  constructor(private page: Page) {
    this.heading        = page.getByRole('heading', { name: /知識庫類別|KM Category/i });
    this.categoryRows   = page.locator('[data-testid="category-row"]');
    this.addCategoryBtn = page.getByRole('button', { name: /新增類別|Add Category/i });
    this.nameInput      = page.getByLabel(/類別名稱|Category Name/i);
    this.saveBtn        = page.getByRole('button', { name: /確認|Save/i });
    this.nameError      = page.getByText(/名稱必填|Name is required/i);
    this.duplicateError = page.getByText(/名稱重複|Duplicate|已存在/i);
  }

  async goto() {
    await this.page.goto('/km/category');
    await this.page.waitForLoadState('networkidle');
  }

  async addCategory(name: string, parentName?: string) {
    await this.addCategoryBtn.click();
    if (parentName) {
      await this.page.getByLabel(/上層類別|Parent/i).click();
      await this.page.getByRole('option', { name: parentName }).click();
    }
    await this.nameInput.fill(name);
    await this.saveBtn.click();
    await this.page.waitForLoadState('networkidle');
  }

  async isLoaded(): Promise<boolean> { return this.heading.isVisible(); }
}
