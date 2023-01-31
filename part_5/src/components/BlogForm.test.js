import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

describe('<BlogForm />', () => {
  test('New blog has right details when it is created', async () => {
    const addBlog = jest.fn()
    const user = userEvent.setup()

    render( <BlogForm addBlog={addBlog} />)

    const inputTitle = screen.getByPlaceholderText('title of the blog')
    const inputAuthor = screen.getByPlaceholderText('author of the blog')
    const inputrl = screen.getByPlaceholderText('add url here')

    const createButton = screen.getByText('Create')

    await user.type(inputTitle, 'Understand JavaScript this Keyword in Depth')
    await user.type(inputAuthor, 'Marius Schulz')
    await user.type(inputrl, 'https://egghead.io/courses/understand-javascript-s-this-keyword-in-depth')
    await user.click(createButton)

    expect(addBlog.mock.calls).toHaveLength(1)
    expect(addBlog.mock.calls[0][0].title).toBe('Understand JavaScript this Keyword in Depth')
    expect(addBlog.mock.calls[0][0].author).toBe('Marius Schulz')
    expect(addBlog.mock.calls[0][0].url).toBe('https://egghead.io/courses/understand-javascript-s-this-keyword-in-depth')
  })
})