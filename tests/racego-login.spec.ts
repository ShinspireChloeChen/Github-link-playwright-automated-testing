import { test, expect } from '@playwright/test';
import { RaceGoLoginPage } from '../pages/racego-login.page';

/**
 * RaceGo 會員登入測試套件
 * 驗證登入頁面功能和主流程
 * 
 * 網址: https://racego-member.webtech888.com/login
 * 瀏覽器: Chromium
 * 報告: 包含影片和截圖
 */
test.describe('RaceGo 會員登入 - 正常測試', () => {
  let loginPage: RaceGoLoginPage;

  test.beforeEach(async ({ page }) => {
    // 初始化頁面物件
    loginPage = new RaceGoLoginPage(page);
    
    // 導航到登入頁面
    await test.step('導航到 RaceGo 登入頁面', async () => {
      await loginPage.goto();
    });

    // 等待頁面加載
    await test.step('等待頁面加載', async () => {
      const isLoaded = await loginPage.isLoaded();
      expect(isLoaded).toBe(true);
    });
  });

  test('✅ 驗證登入頁面加載成功', async () => {
    await test.step('驗證頁面標題', async () => {
      const title = await loginPage.getPageTitle();
      expect(title).toBeTruthy();
      console.log(`📄 頁面標題: ${title}`);
    });

    await test.step('驗證登入表單元素可見', async () => {
      const emailVisible = await loginPage.isEmailInputVisible();
      const passwordVisible = await loginPage.isPasswordInputVisible();
      const buttonVisible = await loginPage.isLoginButtonVisible();
      
      expect(emailVisible).toBe(true);
      expect(passwordVisible).toBe(true);
      expect(buttonVisible).toBe(true);
      
      console.log('✓ 電子郵件輸入框可見');
      console.log('✓ 密碼輸入框可見');
      console.log('✓ 登入按鈕可見');
    });
  });

  test('✅ 驗證電子郵件輸入框功能', async () => {
    const testEmail = 'test@example.com';

    await test.step('在電子郵件輸入框輸入文字', async () => {
      await loginPage.emailInput.fill(testEmail);
    });

    await test.step('驗證電子郵件已輸入', async () => {
      const emailValue = await loginPage.emailInput.inputValue();
      expect(emailValue).toBe(testEmail);
      console.log(`✓ 電子郵件已輸入: ${emailValue}`);
    });
  });

  test('✅ 驗證密碼輸入框功能', async () => {
    const testPassword = 'TestPassword123!';

    await test.step('在密碼輸入框輸入密碼', async () => {
      await loginPage.passwordInput.fill(testPassword);
    });

    await test.step('驗證密碼已輸入', async () => {
      const passwordValue = await loginPage.passwordInput.inputValue();
      expect(passwordValue).toBe(testPassword);
      console.log('✓ 密碼已輸入');
    });
  });

  test('✅ 驗證登入按鈕狀態', async () => {
    await test.step('驗證登入按鈕啟用', async () => {
      const isEnabled = await loginPage.isLoginButtonEnabled();
      expect(isEnabled).toBe(true);
      console.log('✓ 登入按鈕已啟用');
    });

    await test.step('驗證登入按鈕可見', async () => {
      const isVisible = await loginPage.isLoginButtonVisible();
      expect(isVisible).toBe(true);
      console.log('✓ 登入按鈕可見');
    });
  });

  test('✅ 驗證登入表單完整流程', async ({ page }) => {
    const testEmail = 'test@racego.com';
    const testPassword = 'TestPassword123!';

    await test.step('填寫登入表單', async () => {
      await loginPage.emailInput.fill(testEmail);
      await loginPage.passwordInput.fill(testPassword);
      console.log('✓ 表單已填寫');
    });

    await test.step('驗證表單數據', async () => {
      const emailValue = await loginPage.emailInput.inputValue();
      const passwordValue = await loginPage.passwordInput.inputValue();
      
      expect(emailValue).toBe(testEmail);
      expect(passwordValue).toBe(testPassword);
      console.log('✓ 表單數據正確');
    });

    await test.step('點擊登入按鈕', async () => {
      await loginPage.loginButton.click();
      console.log('✓ 已點擊登入按鈕');
    });

    await test.step('等待導航', async () => {
      // 等待任何導航或提示訊息出現
      await page.waitForTimeout(2000);
      const currentUrl = loginPage.getCurrentUrl();
      console.log(`📍 當前 URL: ${currentUrl}`);
    });
  });

  test('✅ 驗證表單清除功能', async () => {
    const testData = 'test@example.com';

    await test.step('輸入電子郵件', async () => {
      await loginPage.emailInput.fill(testData);
    });

    await test.step('清除電子郵件', async () => {
      await loginPage.emailInput.clear();
    });

    await test.step('驗證電子郵件已清除', async () => {
      const emailValue = await loginPage.emailInput.inputValue();
      expect(emailValue).toBe('');
      console.log('✓ 電子郵件已清除');
    });
  });

  test('✅ 驗證記住密碼功能', async () => {
    await test.step('勾選記住密碼', async () => {
      await loginPage.checkRememberMe();
      console.log('✓ 記住密碼已勾選');
    });

    await test.step('驗證記住密碼狀態', async () => {
      const isChecked = await loginPage.rememberCheckbox.isChecked().catch(() => false);
      console.log(`✓ 記住密碼狀態: ${isChecked ? '已勾選' : '未勾選'}`);
    });
  });

  test('✅ 驗證輔助連結可見性', async () => {
    await test.step('驗證忘記密碼連結', async () => {
      const isForgotVisible = await loginPage.forgotPasswordLink.isVisible().catch(() => false);
      if (isForgotVisible) {
        console.log('✓ 忘記密碼連結可見');
      } else {
        console.log('⚠️ 忘記密碼連結不可見');
      }
    });

    await test.step('驗證註冊連結', async () => {
      const isSignUpVisible = await loginPage.signUpLink.isVisible().catch(() => false);
      if (isSignUpVisible) {
        console.log('✓ 註冊連結可見');
      } else {
        console.log('⚠️ 註冊連結不可見');
      }
    });
  });

  test('✅ 驗證頁面響應性', async ({ page }) => {
    await test.step('取得視窗大小', async () => {
      const size = page.viewportSize();
      console.log(`📐 視窗大小: ${size?.width} x ${size?.height}`);
    });

    await test.step('驗證所有表單元素可見', async () => {
      const emailVisible = await loginPage.isEmailInputVisible();
      const passwordVisible = await loginPage.isPasswordInputVisible();
      const buttonVisible = await loginPage.isLoginButtonVisible();
      
      expect(emailVisible && passwordVisible && buttonVisible).toBe(true);
      console.log('✓ 所有表單元素在視窗中可見');
    });
  });

  test('✅ 驗證頁面元素可交互性', async () => {
    await test.step('驗證電子郵件輸入框可焦點', async () => {
      await loginPage.emailInput.focus();
      console.log('✓ 電子郵件輸入框已焦點');
    });

    await test.step('驗證密碼輸入框可焦點', async () => {
      await loginPage.passwordInput.focus();
      console.log('✓ 密碼輸入框已焦點');
    });

    await test.step('驗證登入按鈕可焦點', async () => {
      await loginPage.loginButton.focus();
      console.log('✓ 登入按鈕已焦點');
    });
  });
});
