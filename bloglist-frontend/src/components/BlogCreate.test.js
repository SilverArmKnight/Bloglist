import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogCreate from './BlogCreate'

describe('BlogCreate tests', () => {
  test('<BlogCreate/> updates parent state and calls onSubmit', async() => {
    const user = userEvent.setup()
    const createBlog = jest.fn()

    render(<BlogCreate createBlog={createBlog} />)

    const title = screen.getByPlaceholderText('write title')
    const author = screen.getByPlaceholderText('write author')
    const url = screen.getByPlaceholderText('write url')

    const createButton = screen.getByText('create')

    await user.type(title, 'title example...')
    await user.type(author, 'author example...')
    await user.type(url, 'url example...')
    await user.click(createButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('title example...')
    expect(createBlog.mock.calls[0][0].author).toBe('author example...')
    expect(createBlog.mock.calls[0][0].url).toBe('url example...')
  })
})