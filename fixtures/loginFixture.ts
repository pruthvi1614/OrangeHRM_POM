import { test as base } from '@playwright/test'
import { AdminLogin } from '../pages/AdminLogin'

export type LoginFixtures = {
  loginPage: AdminLogin
}

export const test = base.extend<LoginFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new AdminLogin(page)
    await loginPage.launchUrl(process.env.Base_Url!)
    await loginPage.HRMLogin(process.env.Base_User!, process.env.Base_Pass!)
    await use(loginPage)
    await loginPage.HRMLogout()
  },
})

export { expect } from '@playwright/test'
