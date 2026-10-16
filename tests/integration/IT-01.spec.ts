import { test, expect } from '@playwright/test';

test('IT-01: top-down REAL Login -> browser-level Inventory STUB', {

    annotation: {

        type: 'description',

        description: 'ทดสอบ Login จริงร่วมกับ Inventory Stub ที่จำลองด้วย page.setContent()'

    }

}, async ({ page }) => {

    await test.step('Login ผ่านหน้าเว็บไซต์จริง', async () => {

        // Login และตรวจสอบ URL inventory.html
        await page.goto('/');

        await page.locator('#user-name').fill('standard_user');
        await page.locator('#password').fill('secret_sauce');
        await page.locator('#login-button').click();
        await expect(page).toHaveURL(/inventory\.html/);

    });

    await test.step('สร้าง Inventory Stub', async () => {

        // ใช้ page.setContent() แสดง Mock Inventory Ready และสินค้าจำลอง 2 รายการ
        await page.setContent(`
  <div>
    <h1>Mock Inventory Ready</h1>
    <div class="inventory_item">Phone</div>
    <div class="inventory_item">Laptop</div>
  </div>
`);

    });

    await test.step('ตรวจสอบผลจาก Stub', async () => {

        // ตรวจสอบข้อความ จำนวน และชื่อสินค้าจำลอง
        // ตรวจสอบข้อความหัวข้อว่าแสดง "Inventory Ready"
        await expect(page.locator('h1')).toHaveText('Mock Inventory Ready');

        // ตรวจสอบจำนวนสินค้าจำลองว่ามี 2 รายการ
        await expect(page.locator('.inventory_item')).toHaveCount(2);

        // ตรวจสอบชื่อสินค้าจำลองแต่ละรายการ
        await expect(page.locator('.inventory_item').nth(0)).toHaveText('Phone');
        await expect(page.locator('.inventory_item').nth(1)).toHaveText('Laptop');

    });

});
