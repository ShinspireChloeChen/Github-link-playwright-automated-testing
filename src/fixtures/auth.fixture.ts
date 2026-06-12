import { test as base, type Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

export const ACCOUNTS = {
  staff:    { username: process.env.STAFF_USER    || 'staff_user',  password: process.env.STAFF_PASS    || 'Staff@1234'    },
  editor:   { username: process.env.EDITOR_USER   || 'km_editor',   password: process.env.EDITOR_PASS   || 'Editor@1234'   },
  reviewer: { username: process.env.REVIEWER_USER || 'km_reviewer', password: process.env.REVIEWER_PASS || 'Reviewer@1234' },
  admin:    { username: process.env.ADMIN_USER     || 'sys_admin',   password: process.env.ADMIN_PASS    || 'Admin@1234'    },
  noKmRole: { username: process.env.NO_KM_USER    || 'noperm_user', password: process.env.NO_KM_PASS    || 'Noperm@1234'   },
} as const;
export type AccountRole = keyof typeof ACCOUNTS;

export const URLS = {
  frontend: process.env.BASE_URL  || 'https://eipnewfront.webtech888.com',
  backend:  process.env.ADMIN_URL || 'https://eipnew.webtech888.com',
};

export async function loginFrontend(page: Page, role: AccountRole = 'editor') {
  const lp = new LoginPage(page);
  await lp.goto(URLS.frontend);
  await lp.login(ACCOUNTS[role].username, ACCOUNTS[role].password);
  await page.waitForURL(/\/(km|knowledge|home)/i, { timeout: 15_000 });
}

export async function loginBackend(page: Page, role: AccountRole = 'admin') {
  const lp = new LoginPage(page);
  await lp.goto(URLS.backend);
  await lp.login(ACCOUNTS[role].username, ACCOUNTS[role].password);
  await page.waitForURL(/\/(dashboard|home)/i, { timeout: 15_000 });
}

type KmFixtures = { frontendPage: Page; backendPage: Page };

export const test = base.extend<KmFixtures>({
  frontendPage: async ({ page }, use) => {
    await loginFrontend(page, 'editor');
    await use(page);
  },
  backendPage: async ({ browser }, use) => {
    const ctx  = await browser.newContext({ baseURL: URLS.backend });
    const page = await ctx.newPage();
    await loginBackend(page, 'admin');
    await use(page);
    await ctx.close();
  },
});

export { expect } from '@playwright/test';
