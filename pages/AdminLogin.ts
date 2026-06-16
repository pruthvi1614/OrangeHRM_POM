import {Page,Locator} from "@playwright/test";

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
        await this.page.goto(url)
    }

    //create function for login page
    async HRMLogin(username: string, password: string) {
        await this.userNameInput.clear()
        await this.userNameInput.fill(username)
        await this.passwordInput.clear()
        await this.passwordInput.fill(password)
        await this.loginButton.click()
    }

    //method for logout
    async HRMLogout() {
        await this.welcomeMenu.click()
        await this.logout.click()
    }

}

