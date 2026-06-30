import { test, expect } from '../fixtures/loginFixture'
import { AddEmp } from '../pages/AddEmp'

test.describe("HRM Employee Management", () => {
    let addEmp: AddEmp

    test.beforeEach(async ({ page, loginPage }) => {
        void loginPage
        addEmp = new AddEmp(page)
    })

    test("Add New Employee successfully", async ({ page }) => {
        await addEmp.add_emp("Pruthvi", "Raj", "Kumar")
    })
})