import { Page, Locator, expect } from "@playwright/test"

export class Admin_Jobs {
    readonly page: Page
    readonly clickAdmin: Locator
    readonly job: Locator
    readonly jobTitles: Locator
    readonly payGrades: Locator
    readonly employmentStatus: Locator
    readonly jobCategories: Locator
    readonly workShifts: Locator
    readonly addBtn: Locator
    readonly deleteBtn: Locator
    readonly deleteConfirm: Locator
    readonly jobTitleTxt: Locator
    readonly jobDescTxt: Locator
    readonly jobNoteTxt: Locator
    readonly saveBtn: Locator
    readonly cancelBtn: Locator
    readonly saveSuccessMsg: Locator
    readonly deleteSuccessMsg: Locator

    constructor(page: Page) {
        this.page = page
        this.clickAdmin = page.locator('b').filter({ hasText: 'Admin' })
        this.job = page.getByText('Job', { exact: true })
        this.jobTitles = page.getByRole('link', { name: 'Job Titles' })
        this.payGrades = page.getByRole('link', { name: 'Pay Grades' })
        this.employmentStatus = page.getByRole('link', { name: 'Employment Status' })
        this.jobCategories = page.getByRole('link', { name: 'Job Categories' })
        this.workShifts = page.getByRole('link', { name: 'Work Shifts' })
        this.addBtn = page.getByRole('button', { name: 'Add' })
        this.deleteBtn = page.getByRole('button', { name: 'Delete' })
        this.deleteConfirm = page.getByRole('button',{name:'Ok'})
        this.jobTitleTxt = page.locator('#jobTitle_jobTitle')
        this.jobDescTxt = page.locator('#jobTitle_jobDescription')
        this.jobNoteTxt = page.locator('#jobTitle_note')
        this.saveBtn = page.getByRole('button', { name: 'Save' })
        this.cancelBtn = page.getByRole('button', { name: 'Cancel' })
        this.saveSuccessMsg = page.getByText('Successfully Saved Close', { exact: true })
        this.deleteSuccessMsg = page.getByText('Successfully Deleted Close', { exact: true })
    }

    async navToJobTitlesPage() {
        await this.clickAdmin.waitFor({ state: 'visible' })
        await this.clickAdmin.click()
        await this.job.waitFor({ state: 'visible' })
        await this.job.hover()
        await this.jobTitles.waitFor({ state: 'visible' })
        await this.jobTitles.click()
    }

    async navToPayGradesPage() {
        await this.clickAdmin.waitFor({ state: 'visible' })
        await this.clickAdmin.click()
        await this.job.waitFor({ state: 'visible' })
        await this.job.hover()
        await this.payGrades.waitFor({ state: 'visible' })
        await this.payGrades.click()
    }

    async navToEmploymentStatusPage() {
        await this.clickAdmin.waitFor({ state: 'visible' })
        await this.clickAdmin.click()
        await this.job.waitFor({ state: 'visible' })
        await this.job.hover()
        await this.employmentStatus.waitFor({ state: 'visible' })
        await this.employmentStatus.click()
    }

    async navToJobCategoriesPage() {
        await this.clickAdmin.waitFor({ state: 'visible' })
        await this.clickAdmin.click()
        await this.job.waitFor({ state: 'visible' })
        await this.job.hover()
        await this.jobCategories.waitFor({ state: 'visible' })
        await this.jobCategories.click()
    }
    async navToWorkShiftsPage() {
        await this.clickAdmin.waitFor({ state: 'visible' })
        await this.clickAdmin.click()
        await this.job.waitFor({ state: 'visible' })
        await this.job.hover()
        await this.workShifts.waitFor({ state: 'visible' })
        await this.workShifts.click()
    }

    async addJobTitle(jobTitle: string, jobDescription: string, jobNote: string) {
        await this.addBtn.waitFor({ state: 'visible' })
        await this.addBtn.click()
        await this.jobTitleTxt.waitFor({ state: 'visible' })
        await this.jobTitleTxt.fill(jobTitle)
        await this.jobDescTxt.waitFor({ state: 'visible' })
        await this.jobDescTxt.fill(jobDescription)
        await this.jobNoteTxt.waitFor({ state: 'visible' })
        await this.jobNoteTxt.fill(jobNote)
        await this.saveBtn.waitFor({ state: 'visible' })
        await this.saveBtn.click()
    }
    async vadilateJobSaveSuccessfully(jobTitle: string) {
        await expect(this.saveSuccessMsg).toBeVisible({ timeout: 30000 })
        await expect(this.saveSuccessMsg).toContainText('Successfully Saved', { timeout: 30000 })
        console.log(`Saved record: ${jobTitle}`)
        await expect(this.page.locator('tbody tr').filter({ hasText: `${jobTitle}` })).toHaveCount(1, { timeout: 30000 })
    }

    async deleteJobRecord(jobTitle: string) {
        const row = this.page.locator('tbody tr').filter({ hasText: `${jobTitle}` })
        await expect(row).toBeVisible({ timeout: 25000 })
        const checkbox = row.locator('input')
        await expect(checkbox).toBeVisible({ timeout: 15000 })
        await checkbox.check()
        await expect(this.deleteBtn).toBeVisible({ timeout: 15000 })
        await this.deleteBtn.click()
        await this.deleteConfirm.click()
    }
    async vadilateDeleteSuccessfully(jobTitle: string) {
        await expect(this.deleteSuccessMsg).toBeVisible({ timeout: 30000 })
        await expect(this.deleteSuccessMsg).toContainText('Successfully Deleted', { timeout: 30000 })
        console.log(`Deleted job title record: ${jobTitle}`)
        await expect(this.page.locator('tbody tr').filter({ hasText: `${jobTitle}` })).toHaveCount(0, { timeout: 30000 })
    }
}