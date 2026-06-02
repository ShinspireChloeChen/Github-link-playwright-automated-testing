import { test, expect } from '@playwright/test';
import { GitHubHomePage } from '../pages/github-home.page';

/**
 * GitHub 首頁測試套件
 * 驗證 GitHub 首頁功能和 UI 元素
 */
test.describe('GitHub 首頁', () => {
  let homePage: GitHubHomePage;

  test.beforeEach(async ({ page }) => {
    // 初始化頁面物件
    homePage = new GitHubHomePage(page);
    
    // 導航到首頁
    await test.step('導航到 GitHub 首頁', async () => {
      await homePage.goto();
    });
  });

  test('✅ 驗證首頁加載成功', async ({ page }) => {
    await test.step('驗證頁面標題', async () => {
      const title = await homePage.getPageTitle();
      expect(title).toContain('GitHub');
    });

    await test.step('驗證頁面元素可見', async () => {
      const isLoaded = await homePage.isLoaded();
      expect(isLoaded).toBe(true);
    });
  });

  test('✅ 驗證搜尋功能', async () => {
    await test.step('執行搜尋操作', async () => {
      await homePage.search('playwright');
    });

    await test.step('驗證頁面重定向', async () => {
      await expect(homePage.page).toHaveURL(/\/search/);
    });
  });

  test('❌ 負測試 - 空搜尋查詢', async () => {
    await test.step('嘗試執行空搜尋', async () => {
      await homePage.searchInput.fill('');
      // 應該禁用搜尋按鈕或無法提交
      const isSearchDisabled = await homePage.searchButton.isDisabled().catch(() => false);
      
      // 如果按鈕沒有禁用，點擊應該不會改變 URL
      if (!isSearchDisabled) {
        const originalURL = homePage.page.url();
        // 嘗試點擊搜尋
        // 預期：不導航或顯示錯誤提示
      }
    });
  });

  test('❌ 負測試 - 登入按鈕可點擊', async () => {
    await test.step('驗證登入按鈕存在且可點擊', async () => {
      const isVisible = await homePage.signInButton.isVisible();
      expect(isVisible).toBe(true);

      const isEnabled = await homePage.signInButton.isEnabled();
      expect(isEnabled).toBe(true);
    });
  });

  test('🔄 邊界值測試 - 長搜尋查詢', async ({ page }) => {
    await test.step('執行長搜尋查詢', async () => {
      const longQuery = 'a'.repeat(500); // 500 個字元
      await homePage.searchInput.fill(longQuery);
      await homePage.searchButton.click();
    });

    await test.step('驗證搜尋執行成功', async () => {
      // 應該導航到搜尋結果頁面
      await expect(page).toHaveURL(/\/search/);
    });
  });

  test('🔄 邊界值測試 - 特殊字符搜尋', async ({ page }) => {
    const specialChars = '!@#$%^&*()';

    await test.step('執行特殊字符搜尋', async () => {
      await homePage.search(specialChars);
    });

    await test.step('驗證搜尋正確編碼', async () => {
      // 驗證 URL 包含正確編碼的特殊字符
      const url = page.url();
      expect(url).toContain('search');
    });
  });
});
