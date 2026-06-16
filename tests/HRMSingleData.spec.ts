import { test, expect } from '@playwright/test'
import { AdminLogin } from '../pages/AdminLogin'
import { AddEmp } from '../pages/AddEmp'
import * as dotenv from 'dotenv'
dotenv.config()

test.describe("HRM Employee Management", () => {
    let login: AdminLogin
    let addEmp: AddEmp

    test.beforeEach(async ({ page }) => {
        login = new AdminLogin(page)
        addEmp = new AddEmp(page)
        await login.launchUrl(process.env.Base_Url!)
        await login.HRMLogin(process.env.Base_User!, process.env.Base_Pass!)
    })

    test("Add New Employee successfully", async ({ page }) => {
        await addEmp.add_emp("Pruthvi", "Raj", "Kumar")
    })

    test.afterEach(async ({ page }) => {
        await login.HRMLogout()
    })

})