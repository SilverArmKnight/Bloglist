import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Blog tests', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Full Stack Open Tutorial',
    url: 'https://fullstackopen.com/en/',
    likes: 0,
    user: { name: 'Matti Luukkainen' }
  }

  // Check if user matches the user listed in blog.
  const user = { name: 'Matti Luukkainen' }
  const mockHandler = jest.fn()  // For 5.14.

  test('Before clicking the show button', () => {
    // If 'view' is there, that means url, likes and adder are not displayed.
    const { container } = render(<Blog blog={blog} user={user} handleLike={mockHandler}/>)
    const div = container.querySelector('.blog')

    expect(div).toHaveTextContent(
      'Component testing is done with react-testing-library Full Stack Open Tutorial view'
    )
  })

  test('After clicking the show button', async() => {
    // My own solution. I understand the render thing now.
    const { container } = render(<Blog blog={blog} user={user} handleLike={mockHandler}/>)
    const users = userEvent.setup()
    const viewButton = screen.getByText('view')

    await users.click(viewButton)

    const div = container.querySelector('.blog')
    expect(div).toHaveTextContent(
      'Component testing is done with react-testing-library Full Stack Open Tutorial hide'
    )

    // Check if the blog info is displayed.
    expect(div).toHaveTextContent('https://fullstackopen.com/en/')
    expect(div).toHaveTextContent('likes 0')
  })

  test('Clicking the like button', async() => {
    // If you don't render this, there will be nothing on the screen.
    render(<Blog blog={blog} user={user} handleLike={mockHandler}/>)

    // Click the view button.
    const users = userEvent.setup()
    const viewButton = screen.getByText('view')
    await users.click(viewButton)

    // Click the like button twice.
    const likeButton = screen.getByText('like')
    await users.click(likeButton)
    await users.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})