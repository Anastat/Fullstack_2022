import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container, mockHandler

  const blog = {
    id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  }

  const userId = "71b54a676234d17f8"

  beforeEach(() => {
    mockHandler = jest.fn() 
    deleteHandler = jest.fn() 

    container = render(
      <Blog 
        blog={blog} 
        addLike={mockHandler}
        deleteBlog={deleteHandler}
        userId={userId}
      />
    ).container
  })

  test('in beginning URL and likes are not displayed', () => {
    const nameDiv = container.querySelector('.blog-name-author')
    const urlDiv = container.querySelector('.blog-url')
    const likesDiv = container.querySelector('.blog-likes')

    expect(nameDiv).toBeDefined()
    expect(urlDiv).toBeNull()
    expect(likesDiv).toBeNull()
  })

  test('when the button is clicked, all content is displayed.', async () => {
    const user = userEvent.setup()
    const button = container.querySelector('.btn-visibility')
    await user.click(button)
 
    const urlDiv = container.querySelector('.blog-url')
    const likesDiv = container.querySelector('.blog-likes')

    expect(urlDiv).toBeDefined()
    expect(likesDiv).toBeDefined()
  })

  test('when the like button is clicked twice, event called twice.', async () => {
    const user = userEvent.setup()
    const button = container.querySelector('.btn-visibility')
    await user.click(button)
 
    const likeButton = screen.getByText('Like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})