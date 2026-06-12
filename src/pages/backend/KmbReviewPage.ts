import { type Page, type Locator } from '@playwright/test';

export class KmbReviewPage {
  readonly heading: Locator; readonly reviewTable: Locator; readonly tableRows: Locator;
  readonly selectAllChk: Locator; readonly statusFilter: Locator; readonly expireFilter: Locator;
  readonly startDateInput: Locator; readonly endDateInput: Locator;
  readonly filterBtn: Locator; readonly resetBtn: Locator; readonly batchApproveBtn: Locator;

  constructor(private page: Page) {
    this.heading         = page.getByRole('heading', { name: /知識庫審核|KM Review/i });
    this.reviewTable     = page.locator('table, [data-testid="review-list"]');
    this.tableRows       = page.locator('tbody tr');
    this.selectAllChk    = page.getByRole('checkbox', { name: /全選|Select All/i });
    this.statusFilter    = page.getByRole('combobox', { name: /狀態篩選|Status Filter/i });
    this.expireFilter    = page.getByRole('combobox', { name: /效期|Expiry/i });
    this.startDateInput  = page.getByLabel(/送審日 from|Start Date/i);
    this.endDateInput    = page.getByLabel(/送審日 to|End Date/i);
    this.filterBtn       = page.getByRole('button', { name: /篩選|Filter/i });
    this.resetBtn        = page.getByRole('button', { name: /重設|Reset/i });
    this.batchApproveBtn = page.getByRole('button', { name: /批次核准|Batch Approve/i });
  }

  async goto() { await this.page.goto('/km/review'); await this.page.waitForLoadState('networkidle'); }
  async approveArticle(title: string) { await this.page.getByRole('row', { name: new RegExp(title,'i') }).getByRole('button', { name: /核准|Approve/i }).click(); await this.page.waitForLoadState('networkidle'); }
  async rejectArticle(title: string, reason: string) { await this.page.getByRole('row', { name: new RegExp(title,'i') }).getByRole('button', { name: /退回|Reject/i }).click(); await this.page.getByLabel(/退回原因|Reason/i).fill(reason); await this.page.getByRole('button', { name: /確認|Confirm/i }).click(); await this.page.waitForLoadState('networkidle'); }
  async selectAllRows() { await this.selectAllChk.check(); }
  async deselectAllRows() { await this.selectAllChk.uncheck(); }
  async filterByStatus(status: string) { await this.statusFilter.selectOption(status); await this.page.waitForLoadState('networkidle'); }
  async filterByDateRange(start: string, end: string) { await this.startDateInput.fill(start); await this.endDateInput.fill(end); await this.filterBtn.click(); await this.page.waitForLoadState('networkidle'); }
  async resetFilters() { await this.resetBtn.click(); await this.page.waitForLoadState('networkidle'); }
  async isLoaded() { return this.heading.isVisible(); }
  }
