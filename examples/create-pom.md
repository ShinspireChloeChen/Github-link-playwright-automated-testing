# Create Page Object Example

```typescript
export class LoginPage {
  constructor(private page: Page) {}

  async login(username: string, password: string) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginButton.click();
  }
}
---

### 4. examples/create-spec.md
用途：告訴 Copilot Test Spec 格式。

```markdown
# Playwright Spec Example

```typescript
test.describe('Login', () => {

  test('Valid Login', async ({ page }) => {

    await test.step('Open Login Page', async () => {
      ...
    });

    await test.step('Login', async () => {
      ...
    });

  });

});
---

### 5. examples/create-workflow.md
用途：GitHub Actions 範例。

```markdown
# GitHub Actions Example

```yaml
name: Playwright Tests

on:
  push:
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4

      - run: npm ci

      - run: npx playwright install --with-deps

      - run: npx playwright test
