import { test, expect } from '../fixtures/loginFixture'
import { Admin_Jobs } from '../pages/Admin_Jobs'
import { AdminLogin } from '../pages/AdminLogin'
import { ExcelFileUtil } from '../utils/ExcelFileUtil'
import path from 'node:path'
import type { Page } from '@playwright/test'


const filePath = path.join(__dirname, '../testdata/ExData.xlsx')
const sheetName = 'Job'
let jobData: any

try {
    jobData = ExcelFileUtil.getExcelData(filePath, sheetName)
}
catch (message) {
    console.log(message)
}

test.describe("HRM Admin Job module", () => {
    let adminJobs: Admin_Jobs
    let login: AdminLogin
    let page: Page

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage()
        login = new AdminLogin(page)
        adminJobs = new Admin_Jobs(page)
        await login.launchUrl(process.env.Base_Url!)
        await login.HRMLogin(process.env.Base_User!, process.env.Base_Pass!)
    })

    test.afterAll(async () => {
        try {
            await login.HRMLogout()
            await page.close()
        } catch (error) {
            console.warn('Cleanup logout failed:', error)
        }
    })

    test("Add Job title with valid data", async () => {
        await adminJobs.navToJobTitlesPage()
        for (const data of jobData) {
            await adminJobs.addJobTitle(data.JobTitle, data.JobDescription, data.Note)
            await adminJobs.vadilateJobSaveSuccessfully(data.JobTitle)
        }
    })

    test("Delete the job title", async () => {
        await adminJobs.navToJobTitlesPage()
        for (const data of jobData) {
            await adminJobs.deleteJobRecord(data.JobTitle)
            await adminJobs.vadilateDeleteSuccessfully(data.JobTitle)
        }
    })

})