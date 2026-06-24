import { test, expect } from '@playwright/test'
import { AdminLogin } from '../pages/AdminLogin'
import { Admin_Qualifications } from '../pages/Admin_Qualifications'
import { ExcelFileUtil } from '../utils/ExcelFileUtil'
import path from 'node:path'


const filePath = path.join(__dirname, '../testdata/ExData.xlsx')
const sheetName = 'Qualifications'
let qualificationData: any


try {
    qualificationData = ExcelFileUtil.getExcelData(filePath, sheetName)
}
catch (message) {
    console.log(message)
}

test.describe("HRM Admin Qualifications module", () => {
    let login: AdminLogin
    let adminQualifications: Admin_Qualifications

    test.beforeEach(async ({ page }) => {
        login = new AdminLogin(page)
        adminQualifications = new Admin_Qualifications(page)
        await login.launchUrl(process.env.Base_Url!)
        await login.HRMLogin(process.env.Base_User!, process.env.Base_Pass!)
    })

    test("Add skills with valid data", async () => {
        await adminQualifications.navToSkillsPage()
        for (const data of qualificationData) {
            await adminQualifications.addSkills(data.SkillName, data.SkillDescription)
            await adminQualifications.vadilateSaveSuccessfully(data.SkillName)
        }
    })

    test(`Delete the skills record`, async () => {
        await adminQualifications.navToSkillsPage()
        for (const data of qualificationData) {
            await adminQualifications.deleteRecord(data.SkillName)
            await adminQualifications.vadilateDeleteSuccessfully(data.SkillName)
        }
    })

    test.afterEach(async () => {
        await login.HRMLogout()
    })

})