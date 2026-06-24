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
        await this.page.waitForSelector('.modal-backdrop', { state: 'detached', timeout: 10000 }).catch(() => {})
        await this.welcomeMenu.waitFor({ state: 'visible' })
        await this.welcomeMenu.click()
        await this.logout.waitFor({ state: 'visible' })
        await this.logout.click()
    }

}

