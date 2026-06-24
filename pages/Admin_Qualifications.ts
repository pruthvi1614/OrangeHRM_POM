import { Page, Locator, expect } from "@playwright/test"
import * as allure from "allure-js-commons";

export class Admin_Qualifications {
    readonly page: Page
    readonly clickAdmin: Locator
    readonly qualifications: Locator
    readonly skills: Locator
    readonly education: Locator
    readonly licenses: Locator
    readonly languages: Locator
    readonly memberships: Locator
    readonly addBtn: Locator
    readonly deleteBtn: Locator
    readonly skillName: Locator
    readonly skillDescription: Locator
    readonly saveBtn: Locator
    readonly cancelBtn: Locator
    readonly educationLevel: Locator
    readonly licenseName: Locator
    readonly languageName: Locator
    readonly membershipName: Locator


    constructor(page: Page) {
        this.page = page
        this.clickAdmin = page.locator('b').filter({ hasText: 'Admin' })
        this.qualifications = page.getByRole('link', { name: 'Qualifications' })
        this.skills = page.getByRole('link', { name: 'Skills' })
        this.education = page.getByRole('link', { name: 'Education' })
        this.licenses = page.getByRole('link', { name: 'Licenses' })
        this.languages = page.getByRole('link', { name: 'Languages' })
        this.memberships = page.getByRole('link', { name: 'Memberships' })
        this.addBtn = page.getByRole('button', { name: 'Add' })
        this.deleteBtn = page.getByRole('button', { name: 'Delete' })
        this.skillName = page.locator('#skill_name')
        this.skillDescription = page.locator('#skill_description')
        this.saveBtn = page.getByRole('button', { name: 'Save' })
        this.cancelBtn = page.getByRole('button', { name: 'Cancel' })
        this.educationLevel = page.locator('#education_name')
        this.licenseName = page.locator('#license_name')
        this.languageName = page.locator('#language_name')
        this.membershipName = page.locator('#membership_name')
    }

    async navToSkillsPage() {
        await this.clickAdmin.click()
        await this.qualifications.hover()
        await this.skills.click()
        await this.addBtn.waitFor({ state: 'visible' })
        await expect(this.addBtn).toBeVisible()
    }

    async addSkills(skillName: String, skillDescription: String) {
        await this.addBtn.click()
        await this.skillName.fill(String(skillName))
        await this.skillDescription.fill(String(skillDescription))
        await this.saveBtn.click()
        

    }

    async vadilateSaveSuccessfully(skillName: String) {
        await expect(this.page.getByText('Successfully Saved Close')).toContainText("Successfully Saved")
        console.log(`Saved record: ${skillName}`)
        //await expect(this.page.locator('tbody tr').filter({ hasText: `${skillName}` })).toHaveCount(1) //works as containes text
        await expect(this.page.locator(`a:text-is("${skillName}")`)).toHaveCount(1) //matches exact record
    }

    async deleteRecord(skillName: String) {
        const row = this.page.locator('tr').filter({ hasText: `${skillName}` })
        await row.locator('.checkboxAtch').check()
        await this.deleteBtn.click()
        
    }

    async vadilateDeleteSuccessfully(skillName: String) {
        await expect(this.page.getByText('Successfully Deleted Close')).toContainText("Successfully Deleted")
        console.log(`Deleted record: ${skillName}`)
        await expect(this.page.locator('tbody tr').filter({ hasText: `${skillName}` })).toHaveCount(0)
        // const allRows = await this.page.locator('tbody tr').allTextContents()
        // console.log(allRows)
        // await expect(allRows).not.toContain(expect.stringContaining(`${skillName}`))
    }
}