import { Page, Locator, expect } from "@playwright/test"
import { BasePage } from './BasePage'

export class Admin_Qualifications extends BasePage {
    readonly clickAdmin: Locator
    readonly qualifications: Locator
    readonly skills: Locator
    readonly education: Locator
    readonly licenses: Locator
    readonly languages: Locator
    readonly memberships: Locator
    readonly addBtn: Locator
    readonly deleteBtn: Locator
    readonly deleteMembershipBtn: Locator
    readonly deleteConfirmBtn: Locator
    readonly skillName: Locator
    readonly skillDescription: Locator
    readonly saveBtn: Locator
    readonly cancelBtn: Locator
    readonly educationLevel: Locator
    readonly licenseName: Locator
    readonly languageName: Locator
    readonly membershipName: Locator
    readonly duplicateSkillErrorMsg: Locator
    readonly duplicateLevelError: Locator
    readonly duplicateLicenseError: Locator
    readonly duplicateLanguageError: Locator
    readonly duplicateMembershipError: Locator
    readonly saveSuccessMsg: Locator
    readonly deleteSuccessMsg: Locator

    constructor(page: Page) {
        super(page)
        this.clickAdmin = page.locator('b').filter({ hasText: 'Admin' })
        this.qualifications = page.getByRole('link', { name: 'Qualifications' })
        this.skills = page.getByRole('link', { name: 'Skills' })
        this.education = page.getByRole('link', { name: 'Education' })
        this.licenses = page.getByRole('link', { name: 'Licenses' })
        this.languages = page.getByRole('link', { name: 'Languages' })
        this.memberships = page.getByRole('link', { name: 'Memberships' })
        this.addBtn = page.getByRole('button', { name: 'Add' })
        this.deleteBtn = page.getByRole('button', { name: 'Delete' })
        this.deleteMembershipBtn = page.locator('#btnDelete')
        this.deleteConfirmBtn = page.getByRole('button', { name: 'Ok' })
        this.skillName = page.locator('#skill_name')
        this.skillDescription = page.locator('#skill_description')
        this.saveBtn = page.getByRole('button', { name: 'Save' })
        this.cancelBtn = page.getByRole('button', { name: 'Cancel' })
        this.educationLevel = page.locator('#education_name')
        this.licenseName = page.locator('#license_name')
        this.languageName = page.locator('#language_name')
        this.membershipName = page.locator('#membership_name')
        this.duplicateSkillErrorMsg = page.getByText('Already exists', { exact: true })
        this.duplicateLevelError = page.getByText('Level Already Exists', { exact: false })
        this.duplicateLicenseError = page.getByText('Name Already Exists', { exact: false })
        this.duplicateLanguageError = page.getByText('Name Already Exists', { exact: false })
        this.duplicateMembershipError = page.getByText('Already exists', { exact: false })
        this.saveSuccessMsg = page.getByText('Successfully Saved Close', { exact: true })
        this.deleteSuccessMsg = page.getByText('Successfully Deleted Close', { exact: true })
    }

    async navToSkillsPage() {
        await this.clickElement(this.clickAdmin)
        await this.qualifications.waitFor({ state: 'visible', timeout: 30000 })
        await this.qualifications.hover()
        await this.clickElement(this.skills, { force: true })
        await this.addBtn.waitFor({ state: 'visible', timeout: 30000 })
        await expect(this.addBtn).toBeVisible()
    }

    async navToEducationPage() {
        await this.clickElement(this.clickAdmin)
        await this.qualifications.waitFor({ state: 'visible', timeout: 30000 })
        await this.qualifications.hover()
        await this.clickElement(this.education, { force: true })
        await this.addBtn.waitFor({ state: 'visible', timeout: 30000 })
        await expect(this.addBtn).toBeVisible()
    }

    async navToLicensesPage() {
        await this.clickElement(this.clickAdmin)
        await this.qualifications.waitFor({ state: 'visible', timeout: 30000 })
        await this.qualifications.hover()
        await this.clickElement(this.licenses, { force: true })
        await this.addBtn.waitFor({ state: 'visible', timeout: 30000 })
        await expect(this.addBtn).toBeVisible()
    }

    async navToLanguagesPage() {
        await this.clickElement(this.clickAdmin)
        await this.qualifications.waitFor({ state: 'visible', timeout: 30000 })
        await this.qualifications.hover()
        await this.clickElement(this.languages, { force: true })
        await this.addBtn.waitFor({ state: 'visible', timeout: 30000 })
        await expect(this.addBtn).toBeVisible()
    }

    async navToMembershipsPage() {
        await this.clickElement(this.clickAdmin)
        await this.qualifications.waitFor({ state: 'visible', timeout: 30000 })
        await this.qualifications.hover()
        await this.clickElement(this.memberships, { force: true })
        await this.addBtn.waitFor({ state: 'visible', timeout: 30000 })
        await expect(this.addBtn).toBeVisible()
    }

    async addSkills(skillName: string, skillDescription: string) {
        await this.addBtn.waitFor({ state: 'visible' })
        await this.addBtn.click()
        await this.skillName.waitFor({ state: 'visible' })
        await this.skillName.fill(skillName)
        await this.skillDescription.waitFor({ state: 'visible' })
        await this.skillDescription.fill(skillDescription)
        await this.saveBtn.waitFor({ state: 'visible' })
        await this.saveBtn.click()
    }

    async vadilateSaveSuccessfully(skillName: string) {
        await expect(this.page.locator('tbody tr').filter({ hasText: `${skillName}` })).toHaveCount(1, { timeout: 30000 }).catch(async () => {
            await this.page.waitForTimeout(1000)
            await expect(this.page.locator('tbody tr').filter({ hasText: `${skillName}` })).toHaveCount(1, { timeout: 30000 })
        })
        await expect(this.saveSuccessMsg).toBeVisible({ timeout: 10000 }).catch(() => {})
        console.log(`Saved record: ${skillName}`)
    }

    async deleteRecord(skillName: string) {
        const row = this.page.locator('tbody tr').filter({ hasText: `${skillName}` })
        await expect(row).toBeVisible({ timeout: 25000 }).catch(async () => {
            await this.page.reload({ waitUntil: 'domcontentloaded' })
            await expect(row).toBeVisible({ timeout: 25000 })
        })
        const checkbox = row.locator('.checkboxAtch')
        await expect(checkbox).toBeVisible({ timeout: 15000 })
        await checkbox.check()
        await expect(this.deleteBtn).toBeVisible({ timeout: 15000 })
        await this.deleteBtn.click()
    }

    async deleteMembershipRecord(skillName: string) {
        await this.page.waitForLoadState('domcontentloaded')
        const row = this.page.locator('table tbody tr').filter({ hasText: `${skillName}` })
        await expect(row).toBeVisible({ timeout: 30000 }).catch(async () => {
            await this.navToMembershipsPage()
            await expect(row).toBeVisible({ timeout: 30000 })
        })
        const checkbox = row.locator('input[type="checkbox"]').first()
        await checkbox.waitFor({ state: 'visible', timeout: 15000 })
        await checkbox.check()
        await this.deleteMembershipBtn.waitFor({ state: 'visible', timeout: 15000 })
        await this.deleteMembershipBtn.click()
        await this.deleteConfirmBtn.waitFor({ state: 'visible', timeout: 15000 })
        await this.deleteConfirmBtn.click()
        await this.page.waitForTimeout(500)
    }

    async clickCancelBtn() {
        await this.cancelBtn.waitFor({ state: 'visible', timeout: 15000 })
        await this.cancelBtn.click()
    }

    async vadilateDeleteSuccessfully(skillName: string) {
        await expect(this.deleteSuccessMsg).toBeVisible({ timeout: 30000 })
        await expect(this.deleteSuccessMsg).toContainText('Successfully Deleted', { timeout: 30000 })
        console.log(`Deleted record: ${skillName}`)
        await expect(this.page.locator('tbody tr').filter({ hasText: `${skillName}` })).toHaveCount(0, { timeout: 30000 })
    }

    async skillAlreadyExistMsg() {
        await expect(this.duplicateSkillErrorMsg).toBeVisible({ timeout: 15000 })
    }

    async levelAlreadyExistMsg() {
        await expect(this.duplicateLevelError).toBeVisible()
        await expect(this.duplicateLevelError).toContainText('Level Already Exists')
    }

    async licenseAlreadyExistMsg() {
        await expect(this.duplicateLicenseError).toBeVisible()
        await expect(this.duplicateLicenseError).toContainText('Name Already Exists')
    }

    async languagesAlreadyExistMsg() {
        await expect(this.duplicateLanguageError).toBeVisible()
        await expect(this.duplicateLanguageError).toContainText('Name Already Exists')
    }

    async membershipsAlreadyExistMsg() {
        await expect(this.duplicateMembershipError).toBeVisible()
        await expect(this.duplicateMembershipError).toContainText('Already exists')
    }

    async addEducationLevel(educationLevel: string) {
        await this.addBtn.waitFor({ state: 'visible', timeout: 30000 })
        await this.addBtn.click()
        await this.waitForSpinnerToDisappear()
        await this.educationLevel.waitFor({ state: 'visible', timeout: 20000 }).catch(async () => {
            await this.addBtn.click({ force: true })
            await this.educationLevel.waitFor({ state: 'visible', timeout: 20000 })
        })
        await this.fillField(this.educationLevel, educationLevel)
        await this.saveBtn.waitFor({ state: 'visible', timeout: 30000 })
        await this.saveBtn.click()
    }

    async addLicense(licenseName: string) {
        await this.addBtn.waitFor({ state: 'visible', timeout: 30000 })
        await this.addBtn.click()
        await this.waitForSpinnerToDisappear()
        await this.licenseName.waitFor({ state: 'visible', timeout: 20000 }).catch(async () => {
            await this.addBtn.click({ force: true })
            await this.licenseName.waitFor({ state: 'visible', timeout: 20000 })
        })
        await this.fillField(this.licenseName, licenseName)
        await this.saveBtn.waitFor({ state: 'visible', timeout: 30000 })
        await this.saveBtn.click()
    }

    async addLanguage(languageName: string) {
        await this.addBtn.waitFor({ state: 'visible', timeout: 30000 })
        await this.addBtn.click()
        await this.waitForSpinnerToDisappear()
        await this.languageName.waitFor({ state: 'visible', timeout: 20000 }).catch(async () => {
            await this.addBtn.click({ force: true })
            await this.languageName.waitFor({ state: 'visible', timeout: 20000 })
        })
        await this.fillField(this.languageName, languageName)
        await this.saveBtn.waitFor({ state: 'visible', timeout: 30000 })
        await this.saveBtn.click()
    }

    async addMembership(membershipName: string) {
        await this.addBtn.waitFor({ state: 'visible', timeout: 20000 })
        await this.addBtn.click()
        await this.membershipName.waitFor({ state: 'visible', timeout: 20000 })
        await this.membershipName.fill(membershipName)
        await this.saveBtn.waitFor({ state: 'visible', timeout: 20000 })
        await this.saveBtn.click()
        await this.page.waitForTimeout(500)
    }
}
