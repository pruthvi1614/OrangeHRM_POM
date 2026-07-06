import { test as base, expect } from '@playwright/test'
import { AdminLogin } from '../pages/AdminLogin'

export type LoginFixtures = {
  loginPage: AdminLogin
}

// Helper function to remove surrounding quotes from env values
function cleanEnvValue(value: string | undefined): string | undefined {
  if (!value) return value
  // Remove surrounding quotes if present
  if (value.startsWith('"') && value.endsWith('"')) {
    return value.slice(1, -1)
  }
  return value
}

export const test = base.extend<LoginFixtures>({
  loginPage: async ({ page }, use) => {
    const baseUrl = cleanEnvValue(process.env.Base_Url)
    const username = cleanEnvValue(process.env.Base_User)
    const password = cleanEnvValue(process.env.Base_Pass)

    // Validate that all required environment variables are set
    if (!baseUrl) {
      throw new Error('❌ Base_Url environment variable is not set. Please configure it in Jenkins or environment.env file.')
    }
    if (!username) {
      throw new Error('❌ Base_User environment variable is not set. Please configure it in Jenkins credentials or environment.env file.')
    }
    if (!password) {
      throw new Error('❌ Base_Pass environment variable is not set. Please configure it in Jenkins credentials or environment.env file.')
    }

    const loginPage = new AdminLogin(page)
    await loginPage.launchUrl(baseUrl)
    await loginPage.HRMLogin(username, password)
    await use(loginPage)
    await loginPage.HRMLogout()
  },
})

export { expect }