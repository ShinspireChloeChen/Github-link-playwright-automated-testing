import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton:   Locator;
    private readonly captchaInput:  Locator;

  constructor(private page: Page) {
        this.usernameInput = page.getByLabel(/帳號|Username/i);
        this.passwordInput = page.getByLabel(/密碼|Password/i);
        this.loginButton   = page.getByRole('button', { name: /登入|Login/i });
        this.captchaInput  = page.getByPlaceholder(/驗證碼|Captcha/i);
  }

  async goto(baseUrl: string) { await this.page.goto(`${baseUrl}/login`); }

  // 標準登入（需要驗證碼）
  async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
  }

  // 繞過驗證碼登入 — 使用 localStorage 存儲登入信息
  async loginBypassCaptcha(username: string, password: string, bucode: string = 'BU0000000000') {
        // 設置 localStorage 中的記住信息
      await this.page.evaluate((data) => {
              localStorage.setItem('cdp_remember', JSON.stringify(data));
              localStorage.setItem('cdp_buId', '0');
              localStorage.setItem('cdp_lang', 'zh_TW');
      }, {
              CBucode: bucode,
              Account: username,
              Password: password,
              activeTab: 'normal'
      });

      // 導向到首頁，系統應該會自動登入
      await this.page.goto(this.page.url().split('/login')[0]);
        await this.page.waitForLoadState('networkidle');
  }

  // 等待並關閉「必須閱讀文章」彈窗
  async closeRequiredArticleModal() {
        const modal = this.page.locator('text=/您有必須閱讀之文章/');
        const closeBtn = this.page.getByRole('button', { name: /關閉|Close/i }).first();

      if (await modal.isVisible({ timeout: 5000 }).catch(() => false)) {
              await closeBtn.click();
              await this.page.waitForLoadState('networkidle');
      }
  }
}
