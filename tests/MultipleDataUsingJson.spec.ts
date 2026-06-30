import { test, expect } from '../fixtures/loginFixture'
import { AddEmp } from '../pages/AddEmp'
import { AdminLogin } from '../pages/AdminLogin'
import type { Page } from '@playwright/test'
import employeeData from '../testdata/employee.json'

test.describe("Adding Multiple Employees Data from JSON", () => {
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

    // Loop through each employee data from the JSON file and create a test for each
    for (const empData of employeeData) {
        test(`Add New Employee: ${empData.firstName}`,
            async () => {
                // Call the add_emp method with data from JSON
                await addEmp.add_emp(empData.firstName, empData.middleName, empData.lastName)
            })
    }
})