import { expect, test } from '@playwright/test'

test.describe('HelioGrid smoke routes', () => {
  test('opens the dashboard', async ({ page }) => {
    await page.goto('./')

    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
    await expect(page.getByText('Mission Value').first()).toBeVisible()
    await expect(page.getByText('Mission Value by Month')).toBeVisible()
  })

  test('opens operators and navigates to operator details', async ({ page }) => {
    await page.goto('./operators')

    await expect(page.getByRole('heading', { name: 'Operators', exact: true })).toBeVisible()
    await expect(page.getByPlaceholder('Search by name or email')).toBeVisible()
    await expect(page.getByText('Astra Vey').first()).toBeVisible()

    await page
      .getByRole('button', { name: /Astra Vey/ })
      .first()
      .click()

    await expect(page).toHaveURL(/\/operators\/operator-001$/)
    await expect(page.getByRole('heading', { name: 'Operator Details' })).toBeVisible()
    await expect(page.getByText('Latest Mission Orders')).toBeVisible()
  })

  test('shows the operator details fallback for an unavailable record', async ({ page }) => {
    await page.goto('./operators/operator-missing')

    await expect(page.getByRole('heading', { name: 'Operator Details' })).toBeVisible()
    await expect(page.getByText('Operator unavailable')).toBeVisible()
    await expect(page.getByText('Operator details are unavailable for the current access role.')).toBeVisible()
  })

  test('opens the operations ledger', async ({ page }) => {
    await page.goto('./ledger')

    await expect(page.getByRole('heading', { name: 'Operations Ledger' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Export Ledger CSV' })).toBeVisible()
    await expect(page.getByText('ledger rows')).toBeVisible()
  })

  test('opens settings and switches access role', async ({ page }) => {
    await page.goto('./settings')

    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()
    await expect(page.getByText('Access role demo switcher')).toBeVisible()

    await page.getByRole('button', { name: /Operator/ }).click()

    await expect(page.getByRole('heading', { name: 'Operator', exact: true })).toBeVisible()
  })
})
