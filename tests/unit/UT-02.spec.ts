import { test, expect } from '@playwright/test';

test('UT-02: product button state Add to cart -> Remove -> Add to cart', {

    annotation: {

        type: 'description',

        description: 'ตรวจสอบสถานะปุ่ม Add to cart และ Remove รวมถึง Cart Badge'

    }

}, async ({ page }) => {

    await test.step('Login เข้าสู่ระบบ', async () => {

        // Login และตรวจสอบหน้า Inventory
        await page.goto('/');

        await page.locator('#user-name').fill('standard_user');
        await page.locator('#password').fill('secret_sauce');
        await page.locator('#login-button').click();
        await expect(page).toHaveURL(/inventory\.html/);

    });

    await test.step('ตรวจสอบปุ่มก่อนเพิ่มสินค้า', async () => {

        // ตรวจสอบปุ่ม Add to cart ของ Backpack
        await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toBeVisible();
        await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toHaveText('Add to cart');

    });

    await test.step('เพิ่มสินค้าเข้า Cart', async () => {

        // เพิ่มสินค้าและตรวจสอบปุ่ม Remove และ Cart Badge = 1
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

        // ตรวจสอบว่าปุ่มเปลี่ยนเป็น "Remove"
        await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();

        // ตรวจสอบว่าไอคอนตะกร้ามีตัวเลข Badge ขึ้นเป็น 1
        await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    });

    await test.step('ลบสินค้าออกจาก Cart', async () => {

        // ลบสินค้า ตรวจสอบปุ่ม Add to cart และ Cart Badge หายไป
        await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

        // ตรวจสอบว่าปุ่มเปลี่ยนกลับเป็น "Add to cart"
        await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toBeVisible();

        // ตรวจสอบว่าตัวเลข Badge ในตะกร้าหายไป
        await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
    });

});
