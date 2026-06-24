import { Page, Locator, expect } from "@playwright/test";

//Create class for login page for admin
export class AdminLogin {
    //declare variables for login page
    readonly page: Page
    readonly userNameInput: Locator
    readonly passwordInput: Locator
    readonly loginButton: Locator
    readonly welcomeMenu: Locator
    readonly logout: Locator

    constructor(page: Page) {
        this.page = page
        this.userNameInput = page.locator("#txtUsername")
        this.passwordInput = page.locator("#txtPassword")
        this.loginButton =  page.getByRole('button', { name: 'LOGIN', exact: true })
        this.welcomeMenu = page.locator("#welcome")
        this.logout = page.getByRole('link', { name: 'Logout' })
    }

    //method for launching url
    async launchUrl(url: string) {
        await this.page.goto(url, { waitUntil: 'load' })
        await this.userNameInput.waitFor({ state: 'visible', timeout: 30000 })
    }

    //create function for login page
    async HRMLogin(username: string, password: string) {
        await this.userNameInput.waitFor({ state: 'visible' })
        await this.passwordInput.waitFor({ state: 'visible' })
        await this.loginButton.waitFor({ state: 'visible' })
        await this.userNameInput.fill(username)
        await this.passwordInput.fill(password)
        await this.loginButton.click()
        await expect(this.welcomeMenu).toBeVisible()
    }

    //method for logout
    async HRMLogout() {
        if (this.page.url().includes('/auth/login')) {
            return
        }
        await this.page.locator('.modal-backdrop, .loading-mask, .spinner, .overlay, .modal-backdrop.in').waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {})
        await this.welcomeMenu.waitFor({ state: 'visible', timeout: 20000 }).catch(() => null)
        if (!(await this.welcomeMenu.isVisible())) {
            return
        }
        await this.welcomeMenu.click({ force: true })
        await this.page.waitForTimeout(500)
        if (await this.logout.isVisible()) {
            await this.logout.click({ force: true })
        }
    }

}

