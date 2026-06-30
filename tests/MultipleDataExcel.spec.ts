import { test, expect } from '../fixtures/loginFixture'
import { AddEmp } from '../pages/AddEmp'
import { AdminLogin } from '../pages/AdminLogin'
import { ExcelFileUtil } from '../utils/ExcelFileUtil'
import path from 'node:path'
import type { Page } from '@playwright/test'

const filePath = path.join(__dirname, '../testdata/ExData.xlsx')
const sheetName = 'Sheet1'
let employeeData: any


try {
    employeeData = ExcelFileUtil.getExcelData(filePath, sheetName)
}
catch (message) {
    console.log(message)
}

test.describe("Multiple data using Excel", () => {
    let addEmp: AddEmp
    let login: AdminLogin
    let page: Page

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage()
        login = new AdminLogin(page)
        addEmp = new AddEmp(page)
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

    for (const empExData of employeeData) {
        test(`Add Employee using Excel Data: ${empExData.FirstName}`, async () => {
            console.log(`Adding Employee: ${empExData.FirstName} ${empExData.MiddleName} ${empExData.LastName}`)
            await addEmp.add_emp(empExData.FirstName, empExData.MiddleName, empExData.LastName)
        })
    }

})
