import { test, expect,Page } from '@playwright/test'
import { AdminLogin } from '../pages/AdminLogin'
import { Admin_Qualifications } from '../pages/Admin_Qualifications'
import { ExcelFileUtil } from '../utils/ExcelFileUtil'
import path from 'node:path'


const filePath = path.join(__dirname, '../testdata/ExData.xlsx')
const sheetName = 'Qualifications'
let qualificationData: any
let page:Page


try {
    qualificationData = ExcelFileUtil.getExcelData(filePath, sheetName)
}
catch (message) {
    console.log(message)
}

test.describe("HRM Admin Qualifications module", () => {
    let login: AdminLogin
    let adminQualifications: Admin_Qualifications

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage()
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


    test("Delete the skills record", async () => {
        await adminQualifications.navToSkillsPage()
        for (const data of qualificationData) {
            await adminQualifications.deleteRecord(data.SkillName)
            await adminQualifications.vadilateDeleteSuccessfully(data.SkillName)

        }
    })

    test("Verify duplicate skills are not saved", async () => {
        await adminQualifications.navToSkillsPage()
        const data = qualificationData[0]
        await adminQualifications.addSkills(data.SkillName, data.SkillDescription)
        await adminQualifications.vadilateSaveSuccessfully(data.SkillName)
        await adminQualifications.addSkills(data.SkillName, data.SkillDescription)
        await adminQualifications.skillAlreadyExistiMsg()
        await adminQualifications.clickCancelBtn()
        await adminQualifications.deleteRecord(data.SkillName)
    })

    test("Add Education with valid data", async () => {
        await adminQualifications.navToEducationPage()
        for (const data of qualificationData) {
            await adminQualifications.addEducationLevel(data.EducationLevel)
            await adminQualifications.vadilateSaveSuccessfully(data.EducationLevel)
        }
    })

    test("Delete the education record", async () => {
        await adminQualifications.navToEducationPage()
        for (const data of qualificationData) {
            await adminQualifications.deleteRecord(data.EducationLevel)
            await adminQualifications.vadilateDeleteSuccessfully(data.EducationLevel)
        }
    })

    test("Verify duplicate education names are not saved", async () => {
        await adminQualifications.navToEducationPage()
        const data = qualificationData[0]
        await adminQualifications.addEducationLevel(data.EducationLevel)
        await adminQualifications.vadilateSaveSuccessfully(data.EducationLevel)
        await adminQualifications.addEducationLevel(data.EducationLevel)
        await adminQualifications.levelAlreadyExistiMsg()
        await adminQualifications.deleteRecord(data.EducationLevel)
    })

    test("Add License with valid data", async () => {
        await adminQualifications.navToLicensesPage()
        for (const data of qualificationData) {
            await adminQualifications.addLicense(data.LicenceName)
            await adminQualifications.vadilateSaveSuccessfully(data.LicenceName)
        }
    })

    test("Delete the license record", async () => {
        await adminQualifications.navToLicensesPage()
        for (const data of qualificationData) {
            await adminQualifications.deleteRecord(data.LicenceName)
            await adminQualifications.vadilateDeleteSuccessfully(data.LicenceName)
        }
    })

    test("Verify duplicate licenses are not saved", async () => {
        await adminQualifications.navToLicensesPage()
        const data = qualificationData[0]
        await adminQualifications.addLicense(data.LicenceName)
        await adminQualifications.vadilateSaveSuccessfully(data.LicenceName)
        await adminQualifications.addLicense(data.LicenceName)
        await adminQualifications.licenseAlreadyExistiMsg()
        await adminQualifications.deleteRecord(data.LicenceName)
    })


    test("Add Language with valid data", async () => {
        await adminQualifications.navToLanguagesPage()
        for (const data of qualificationData) {
            await adminQualifications.addLanguage(data.LanguageName)
            await adminQualifications.vadilateSaveSuccessfully(data.LanguageName)
        }
    })


    test("Delete the Language record", async () => {
        await adminQualifications.navToLanguagesPage()
        for (const data of qualificationData) {
            await adminQualifications.deleteRecord(data.LanguageName)
            await adminQualifications.vadilateDeleteSuccessfully(data.LanguageName)
        }
    })

    test("Verify duplicate languages are not saved", async () => {
        await adminQualifications.navToLanguagesPage()
        const data = qualificationData[0]
        await adminQualifications.addLanguage(data.LanguageName)
        await adminQualifications.vadilateSaveSuccessfully(data.LanguageName)
        await adminQualifications.addLanguage(data.LanguageName)
        await adminQualifications.languagesAlreadyExistiMsg()
        await adminQualifications.deleteRecord(data.LanguageName)
    })


    test("Add Membership with valid data", async () => {
        await adminQualifications.navToMembershipsPage()
        for (const data of qualificationData) {
            await adminQualifications.addMembership(data.MembershipName)
            await adminQualifications.vadilateSaveSuccessfully(data.MembershipName)
        }
    })

    test("Delete the Membership record", async () => {
        await adminQualifications.navToMembershipsPage()
        for (const data of qualificationData) {
            await adminQualifications.deleteMembershipRecord(data.MembershipName)
            await adminQualifications.vadilateDeleteSuccessfully(data.MembershipName)
        }
    })

    test("Verify duplicate memberships are not saved", async () => {
        await adminQualifications.navToMembershipsPage()
        const data = qualificationData[0]
        await adminQualifications.addMembership(data.MembershipName)
        await adminQualifications.vadilateSaveSuccessfully(data.MembershipName)
        await adminQualifications.addMembership(data.MembershipName)
        await adminQualifications.membershipsAlreadyExistiMsg()
        await adminQualifications.clickCancelBtn()
        await adminQualifications.deleteMembershipRecord(data.MembershipName)
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