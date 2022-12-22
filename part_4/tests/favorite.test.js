const listHelper = require('../utils/list_helper')
const { listWithOneBlog, emptyList, blogs } = require('./mock_blogs')

describe('favorite blog', () => {
 
  test('when list has only one blog, then Edsger', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    expect(result).toEqual({
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5,
    })
  })

  test('of empty list is empty object', () => {
    const result = listHelper.favoriteBlog(emptyList)
    expect(result).toEqual({})
  })

  test('of a bigger list found correctly', () => {
    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual({
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    })
  })

})