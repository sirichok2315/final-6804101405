import { test, expect } from '@playwright/test';

test('ST-02: checkout validation and recovery', {

    annotation: {

        type: 'description',

        description: 'ตรวจสอบ Checkout Validation และการแก้ไขข้อมูลจนสั่งซื้อสำเร็จ'

    }

}, async ({ page }) => {

    await test.step('Login เพิ่มสินค้า และเปิด Checkout', async () => {

        // เตรียมขั้นตอน Checkout ด้วยระบบจริง
        await page.goto('/');
        await page.locator('#user-name').fill('standard_user');
        await page.locator('#password').fill('secret_sauce');
        await page.locator('#login-button').click();
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await page.locator('.shopping_cart_link').click();
        await page.locator('[data-test="checkout"]').click();
        await expect(page).toHaveURL(/.*checkout-step-one\.html/);

    });

    await test.step('ตรวจสอบ First Name is required', async () => {

        // ส่งฟอร์มว่างและตรวจสอบ Error
        await page.locator('[data-test="continue"]').click();
        await expect(page.locator('[data-test="error"]')).toContainText('Error: First Name is required');

    });

    await test.step('ตรวจสอบ Last Name is required', async () => {

        // กรอก First Name และตรวจสอบ Error
        await page.locator('[data-test="firstName"]').fill('John');
        await page.locator('[data-test="continue"]').click();
        await expect(page.locator('[data-test="error"]')).toContainText('Error: Last Name is required');

    });

    await test.step('ตรวจสอบ Postal Code is required', async () => {

        // กรอก Last Name และตรวจสอบ Error
        await page.locator('[data-test="lastName"]').fill('Doe');
        await page.locator('[data-test="continue"]').click();
        await expect(page.locator('[data-test="error"]')).toContainText('Error: Postal Code is required');

    });

    await test.step('แก้ไขข้อมูลและสั่งซื้อสำเร็จ', async () => {

        // กรอก Postal Code, ตรวจสอบ Overview, กด Finish และตรวจสอบข้อความสำเร็จ
        await page.locator('[data-test="postalCode"]').fill('10110');
        await page.locator('[data-test="continue"]').click();

        // ตรวจสอบหน้า Overview และกด Finish
        await expect(page).toHaveURL(/.*checkout-step-two\.html/);
        await page.locator('[data-test="finish"]').click();

        // ตรวจสอบข้อความสั่งซื้อสำเร็จ
        await expect(page).toHaveURL(/.*checkout-complete\.html/);
        await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');

    });

});
