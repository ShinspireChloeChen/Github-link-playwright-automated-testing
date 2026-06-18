import { Page, expect } from '@playwright/test';

export class ShopRecentChangePage {
  readonly url = '/pages/shop-recent-change';

  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto(this.url);
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
  }

  // 選取 nb-select 下拉（Nebular UI 元件）
  async selectNbOption(label: string, optionText: string) {
    const selects = this.page.locator('nb-select');
    for (const sel of await selects.all()) {
      const text = (await sel.innerText()).trim();
      if (text.includes(label) || (await sel.locator('button').innerText()).includes(label)) {
        await sel.click();
        await this.page.waitForTimeout(500);
        const opt = this.page.locator('nb-option').filter({ hasText: optionText }).first();
        await opt.click();
        await this.page.waitForTimeout(300);
        return;
      }
    }
    // fallback: 依順序
    const allSelects = await this.page.locator('nb-select').all();
    const idx = parseInt(label);
    if (!isNaN(idx)) {
      await allSelects[idx].click();
      await this.page.waitForTimeout(500);
      await this.page.locator('nb-option').filter({ hasText: optionText }).first().click();
    }
  }

  // 依 index 選取 nb-select（0=聯徵異動原因, 1=狀態, 2=分行）
  async selectByIndex(index: number, optionText: string) {
    const allSelects = await this.page.locator('nb-select').all();
    await allSelects[index].click();
    await this.page.waitForTimeout(500);
    await this.page.locator('nb-option').filter({ hasText: optionText }).first().click();
    await this.page.waitForTimeout(300);
  }

  async fillCompanyId(value: string) {
    await this.page.fill('input[name="companyId"]', value);
  }

  async fillShopId(value: string) {
    await this.page.fill('input[name="shopId"]', value);
  }

  async fillRegName(value: string) {
    await this.page.fill('input[name="regName"]', value);
  }

  async clickSearch() {
    await this.page.locator('button').filter({ hasText: '查詢' }).first().click();
    await this.page.waitForTimeout(2000);
  }

  async clickExport() {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.page.locator('button').filter({ hasText: '匯出' }).first().click(),
    ]);
    return download;
  }

  async getTableHeaders(): Promise<string[]> {
    return await this.page.locator('th').allInnerTexts();
  }

  async getTableRowCount(): Promise<number> {
    return await this.page.locator('tbody tr').count();
  }

  async getTableCellTexts(row: number): Promise<string[]> {
    return await this.page.locator(`tbody tr:nth-child(${row}) td`).allInnerTexts();
  }

  async clickEditButton(rowIndex: number = 0) {
    // 先點查詢，等待 network idle 確保 Angular 完全渲染
    const searchBtn = this.page.locator('button').filter({ hasText: '查詢' }).first();
    if (await searchBtn.isVisible()) {
      await searchBtn.click();
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(1500);
    }
    const editBtns = this.page.locator('button').filter({ hasText: '編輯' });
    await editBtns.nth(rowIndex).waitFor({ state: 'visible', timeout: 30000 });
    await editBtns.nth(rowIndex).scrollIntoViewIfNeeded();
    await editBtns.nth(rowIndex).click();
    await this.page.waitForTimeout(1500);
  }

  async isNoDataVisible(): Promise<boolean> {
    const noData = this.page.locator('text=無資料, text=查無資料, text=No data');
    return await noData.isVisible().catch(() => false);
  }

  async getCurrentPage(): Promise<number> {
    const val = await this.page.locator('input[type="number"][placeholder="頁數"]').inputValue();
    return parseInt(val) || 1;
  }
}
