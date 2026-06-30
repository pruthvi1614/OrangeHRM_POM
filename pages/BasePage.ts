import { Page, Locator } from '@playwright/test'

export class BasePage {
    protected readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async waitForSpinnerToDisappear() {
        await this.page
            .locator('.modal-backdrop, .loading-mask, .spinner, .overlay, .modal-backdrop.in')
            .waitFor({ state: 'hidden', timeout: 15000 })
            .catch(() => {})
    }

    async waitForPageReady() {
        await this.page.waitForLoadState('domcontentloaded')
        await this.waitForSpinnerToDisappear()
    }

    async clickElement(locator: Locator, options?: { force?: boolean }) {
        await locator.scrollIntoViewIfNeeded().catch(() => {})
        await locator.waitFor({ state: 'visible', timeout: 30000 })
        await locator.click(options)
    }

    async fillField(locator: Locator, value: string) {
        await locator.scrollIntoViewIfNeeded().catch(() => {})
        await locator.waitFor({ state: 'visible', timeout: 30000 })
        await locator.fill(String(value || ''))
    }

    async navigateToAdminSubMenu(mainMenu: Locator, parentMenu: Locator, subMenu: Locator) {
        await this.clickElement(mainMenu)
        await parentMenu.waitFor({ state: 'visible', timeout: 30000 })
        await parentMenu.hover()
        await subMenu.scrollIntoViewIfNeeded().catch(() => {})
        await this.clickElement(subMenu, { force: true })
        await this.waitForPageReady()
    }
}
