const listHelper = require('../utils/list_helper')
const { listWithOneBlog, emptyList, blogs } = require('./mock_blogs')

describe('author with most blogs', () => {

  test('found correctly', () => {
    const result = listHelper.mostBlogs(blogs)
    expect(result).toEqual({
      author: 'Robert C. Martin', 
      blogs: 3
    })
  })

})