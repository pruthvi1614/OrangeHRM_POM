import { test, expect, Page } from '@playwright/test'
import { AdminLogin } from '../pages/AdminLogin'
import { Admin_Jobs } from '../pages/Admin_Jobs'
import { ExcelFileUtil } from '../utils/ExcelFileUtil'
import path from 'node:path'


const filePath = path.join(__dirname, '../testdata/ExData.xlsx')
const sheetName = 'Job'
let jobData: any
let page: Page

try {
    jobData = ExcelFileUtil.getExcelData(filePath, sheetName)
}
catch (message) {
    console.log(message)
}

test.describe("HRM Admin Job module", () => {
    let login: AdminLogin
    let adminJobs: Admin_Jobs

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage()
        login = new AdminLogin(page)
        adminJobs = new Admin_Jobs(page)
        await login.launchUrl(process.env.Base_Url!)
        await login.HRMLogin(process.env.Base_User!, process.env.Base_Pass!)

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

    test.afterAll(async () => {
        try {
            await login.HRMLogout()
            await page.close()
        } catch (error) {
            console.warn('Cleanup logout failed:', error)
        }
    })
})