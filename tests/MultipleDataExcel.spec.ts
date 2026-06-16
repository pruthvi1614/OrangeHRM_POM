import { test, expect } from '@playwright/test'
import { AdminLogin } from '../pages/AdminLogin'
import { AddEmp } from '../pages/AddEmp'
import { ExcelFileUtil } from '../utils/ExcelFileUtil'
import * as dotenv from 'dotenv'
import path from 'node:path'
dotenv.config()

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
    let login: AdminLogin
    let addEmp: AddEmp
    test.beforeEach(async ({ page }) => {
        login = new AdminLogin(page)
        addEmp = new AddEmp(page)
        await login.launchUrl(process.env.Base_Url!)
        await login.HRMLogin(process.env.Base_User!, process.env.Base_Pass!)
    })

    for (const empExData of employeeData) {
        test(`Add Employee using Excel Data: ${empExData.FirstName}`, async () => {
            console.log(`Adding Employee: ${empExData.FirstName} ${empExData.MiddleName} ${empExData.LastName}`)    
            await addEmp.add_emp(empExData.FirstName, empExData.MiddleName, empExData.LastName)
        })
    }

})
