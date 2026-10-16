import { test, expect } from '@playwright/test';

test('IT-02: DRIVER login state -> REAL Inventory and Cart', {

    annotation: {

        type: 'description',

        description: 'ใช้ Driver เตรียมสถานะ Login เพื่อทดสอบ Inventory และ Cart จริง'

    }

}, async ({ browser }) => {

    const context = await browser.newContext();
    const page = await context.newPage();

    await test.step('สร้าง Driver และเปิด Inventory', async () => {

        // สร้าง BrowserContext และใช้ driverOpenInventory() ตั้งค่า Cookie
        // ตั้งค่า Cookie จำลองการ Login (เช่น session-username ของ Saucedemo)
        await context.addCookies([
            {
                name: 'session-username',
                value: 'standard_user',
                url: 'https://www.saucedemo.com'
            }
        ]);

        await page.goto('https://www.saucedemo.com/inventory.html');

    });

    await test.step('ตรวจสอบ Inventory จริง', async () => {

        // ตรวจสอบสินค้า 6 รายการ
        await expect(page.locator('.inventory_item')).toHaveCount(6);

    });

    await test.step('เพิ่มสินค้า 2 รายการ', async () => {

        // เพิ่ม Backpack และ Bike Light แล้วตรวจสอบ Cart Badge = 2
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

        // ตรวจสอบตัวเลขในตะกร้าสินค้าเท่ากับ 2
        await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

    });

    await test.step('ตรวจสอบสินค้าใน Cart', async () => {

        // เปิด Cart และตรวจสอบชื่อสินค้าทั้งสองรายการ
        await page.locator('.shopping_cart_link').click();
        await expect(page).toHaveURL(/.*cart\.html/);

        // ตรวจสอบชื่อสินค้าทั้ง 2 รายการในตะกร้า
        await expect(page.locator('.inventory_item_name').nth(0)).toHaveText('Sauce Labs Backpack');
        await expect(page.locator('.inventory_item_name').nth(1)).toHaveText('Sauce Labs Bike Light');

    });

    // ปิด BrowserContext ที่สร้างเองเมื่อสิ้นสุดการทดสอบ
    await context.close();

});
