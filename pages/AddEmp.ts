import { Page, Locator, expect } from "@playwright/test"

export class AddEmp {
    readonly page: Page
    readonly clickPim: Locator
    readonly clickAdd: Locator
    readonly firstName: Locator
    readonly middleName: Locator
    readonly lastName: Locator
    readonly employeeId: Locator
    readonly clickSave: Locator
    readonly displayPersonalId: Locator

    constructor(page: Page) {
        this.page = page
        this.clickPim = page.getByRole('link', { name: 'PIM' })
        this.clickAdd = page.locator('#btnAdd')
        this.firstName = page.locator("#firstName")
        this.middleName = page.locator("#middleName")
        this.lastName = page.locator("#lastName")
        this.employeeId = page.locator("#employeeId")
        this.clickSave = page.getByRole('button', { name: 'Save' })
        this.displayPersonalId = page.locator("#personal_txtEmployeeId")
    }

    //method for adding employee
    async add_emp(firstName: string, middleName: string, lastName: string) {
        await this.clickPim.click()
        await expect(this.clickAdd).toBeVisible({ timeout: 30000 })
        await expect(this.clickAdd).toBeEnabled({ timeout: 30000 })
        await this.clickAdd.click()

        await this.firstName.waitFor({ state: 'visible' })
        await this.firstName.fill(String(firstName || ""))
        await this.middleName.waitFor({ state: 'visible' })
        await this.middleName.fill(String(middleName || ""))
        await this.lastName.waitFor({ state: 'visible' })
        await this.lastName.fill(String(lastName || ""))
        //capture employee id
        const expectEmpId = await this.employeeId.inputValue()
        //console.log("Expected Employee ID: " + expectEmpId)
        await this.clickSave.click()

        await expect(this.displayPersonalId).toBeVisible({ timeout: 30000 })
        const actualEmpId = await this.displayPersonalId.inputValue()
        //console.log("Actual Employee ID: " + actualEmpId)
        expect(expectEmpId).toBe(actualEmpId)
        return actualEmpId
    }

}