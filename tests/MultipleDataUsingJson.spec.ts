import { test, expect } from '@playwright/test'
import { AdminLogin } from '../pages/AdminLogin'
import { AddEmp } from '../pages/AddEmp'
import * as dotenv from 'dotenv'
import employeeData from '../testdata/employee.json'

dotenv.config()

test.describe("Adding Multiple Employees Data from JSON", () => {
    let login: AdminLogin
    let addEmp: AddEmp

    test.beforeEach(async ({ page }) => {
        login = new AdminLogin(page)
        addEmp = new AddEmp(page)
        await login.launchUrl(process.env.Base_Url!)
        await login.HRMLogin(process.env.Base_User!, process.env.Base_Pass!)
    })

    // Loop through each employee data from the JSON file and create a test for each
    for (const empData of employeeData) {
        test(`Add New Employee: ${empData.firstName}`,
            async ({ page }) => {
                // Call the add_emp method with data from JSON
                await addEmp.add_emp(empData.firstName, empData.middleName, empData.lastName)
            })
    }
})