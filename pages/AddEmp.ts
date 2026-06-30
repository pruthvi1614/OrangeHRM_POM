import { Page, Locator, expect } from "@playwright/test"
import * as allure from "allure-js-commons";
import { BasePage } from './BasePage'

export class AddEmp extends BasePage {
    readonly clickPim: Locator
    readonly clickAdd: Locator
    readonly firstName: Locator
    readonly middleName: Locator
    readonly lastName: Locator
    readonly employeeId: Locator
    readonly clickSave: Locator
    readonly displayPersonalId: Locator
    readonly duplicateError: Locator

    constructor(page: Page) {
        super(page)
        this.clickPim = page.getByRole('link', { name: 'PIM' })
        this.clickAdd = page.locator('#btnAdd')
        this.firstName = page.locator("#firstName")
        this.middleName = page.locator("#middleName")
        this.lastName = page.locator("#lastName")
        this.employeeId = page.locator("#employeeId")
        this.clickSave = page.getByRole('button', { name: 'Save' })
        this.displayPersonalId = page.locator("#personal_txtEmployeeId")
        this.duplicateError = page.getByText('Failed To Save: Employee Id');

    }

    //method for adding employee
    async add_emp(firstName: string, middleName: string, lastName: string) {
        await this.clickPim.click()
        await expect(this.clickAdd).toBeVisible({ timeout: 30000 })
        await expect(this.clickAdd).toBeEnabled({ timeout: 30000 })
        await this.waitForSpinnerToDisappear()
        await this.clickAdd.click()

        await this.page.waitForLoadState('domcontentloaded')
        if (!(await this.firstName.isVisible())) {
            await this.page.waitForTimeout(500)
            if (!(await this.firstName.isVisible())) {
                await this.clickAdd.click({ force: true })
            }
        }

        await this.firstName.waitFor({ state: 'visible', timeout: 30000 })
        await this.firstName.fill(String(firstName || ""))
        await this.middleName.waitFor({ state: 'visible', timeout: 30000 })
        await this.middleName.fill(String(middleName || ""))
        await this.lastName.waitFor({ state: 'visible', timeout: 30000 })
        await this.lastName.fill(String(lastName || ""))

        await expect(this.employeeId).toBeVisible({ timeout: 30000 })
        await expect(this.employeeId).toHaveValue(/\d+/, { timeout: 30000 })
        const expectEmpId = `${Date.now().toString().slice(-6)}`
        await this.employeeId.fill(expectEmpId)
        await expect(this.employeeId).toHaveValue(expectEmpId, { timeout: 30000 })
        await this.clickSave.waitFor({ state: 'visible', timeout: 30000 })
        await this.clickSave.click()

        // Wait briefly for duplicate ID message
        if (await this.duplicateError.isVisible({ timeout: 5000 }).catch(() => false)) {
            const screenshot = await this.page.screenshot({ fullPage: true })
            await allure.attachment('Duplicate Employee ID Error', screenshot, 'image/png')
            console.log(`Employee ID already exists: ${expectEmpId}`)
            throw new Error(`Employee ID already exists: ${expectEmpId}`)
        }

        await expect(this.displayPersonalId).toBeVisible({ timeout: 30000 })
        const actualEmpId = await this.displayPersonalId.inputValue()
        expect(expectEmpId).toBe(actualEmpId)
        return actualEmpId
    }
}