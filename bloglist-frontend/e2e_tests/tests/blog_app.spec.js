/* eslint-disable no-undef */
const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async({ page, request }) => {
    // empty the db here
    // create a user for the backend here
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Galen Rupp',
        username: 'galen',
        password: 'london2012'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    // This is 5.17. Do it and move on to the next project.
    const locator = await page.getByText('log in to application')
    await expect(locator).toBeVisible()
    await page.getByRole('button', { name: 'login' }).click()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      // 5.18
      await page.getByTestId('username').fill('mluukkai')
      await page.getByTestId('password').fill('salainen')

      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      // 5.18
      await page.getByTestId('username').fill('mluukkai')
      await page.getByTestId('password').fill('fso_1')

      await page.getByRole('button', { name: 'login' }).click()

      const loginDiv = await page.locator('.login_notification')
      await expect(loginDiv).toContainText('wrong username or password')
      await expect(loginDiv).toHaveCSS('border-style', 'solid')
      await expect(loginDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      // Login first.
      await page.getByTestId('username').fill('mluukkai')
      await page.getByTestId('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByRole('button', { name: 'create new blog' }).click()

      // Find the textbox and fill them. That's all there is to it.
      await page.getByTestId('title').fill('testing')
      await page.getByTestId('author').fill('playwright')
      await page.getByTestId('url').fill('https://fullstackopen.com/en/part5/end_to_end_testing_playwright')
      await page.getByRole('button', { name: 'create' }).click()
    })

    test('a new blog can be created', async({ page }) => {
      // Check the blog notification message thoroughly.
      const createDiv = await page.locator('.blog_notification')
      await expect(createDiv).toContainText('A new blog testing by playwright added')
      await expect(createDiv).toHaveCSS('border-style', 'solid')
      await expect(createDiv).toHaveCSS('color', 'rgb(0, 128, 0)')
    })

    test('a blog can be liked', async({ page }) => {
      // Click 'view' before liking the blog.
      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()

      const createDiv = await page.locator('.blog_notification')
      await expect(createDiv).toContainText('The blog testing by playwright liked')

      const likeDiv = await page.locator('.blog_likes')
      await expect(likeDiv).toContainText('likes 1')
    })

    test('a blog can be deleted', async({ page }) => {
      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'remove' }).click()

      const createDiv = await page.locator('.blog_notification')
      await expect(createDiv).toContainText('The blog testing by playwright deleted')
    })

    test('only certain users can see the remove button', async({ page }) => {
      // Verify the blog's been added first.
      const createDiv = await page.locator('.blog_notification')
      await expect(createDiv).toContainText('A new blog testing by playwright added')
      await expect(createDiv).toHaveCSS('border-style', 'solid')
      await expect(createDiv).toHaveCSS('color', 'rgb(0, 128, 0)')

      // Login with another user's info.
      await page.getByRole('button', { name: 'logout' }).click()
      await page.getByTestId('username').fill('galen')
      await page.getByTestId('password').fill('london2012')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Galen Rupp logged in')).toBeVisible()

      // Check the remove button.
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()

      // Check the name of the person adding the blog.
      const userDiv = await page.locator('.blog_adder')
      await expect(userDiv).toContainText('Matti Luukkainen')
    })

    test('blogs are arranged in the correct order', async({ page }) => {
      // Add a new blog first.
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByTestId('title').fill('Galen Rupp speaks!')
      await page.getByTestId('author').fill('Galen Rupp')
      await page.getByTestId('url').fill('https://www.youtube.com/watch?v=dHJkhCq3-Uc')
      await page.getByRole('button', { name: 'create' }).click()

      // Like the newly added blog.
      await page.getByRole('button', { name: 'view' }).nth(1).click()
      await page.getByRole('button', { name: 'like' }).click()

      // Hide the liked blog and check the blog order.
      await page.getByRole('button', { name: 'hide' }).click()

      // First blog should be the newly added.
      const blogDiv = await page.locator('.blog').first()
      await expect(blogDiv).toContainText('Galen Rupp speaks! Galen Rupp')

      // Check the second blog that is not liked.
      const blogDiv_2 = await page.locator('.blog').nth(1)
      await expect(blogDiv_2).toContainText('testing playwright')
    })
  })
})

