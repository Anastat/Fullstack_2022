const listHelper = require('../utils/list_helper')
const { listWithOneBlog, emptyList, blogs } = require('./mock_blogs')

describe('author with most likes', () => {

  test('of blogs list found correctly', () => {
    const result = listHelper.mostLikes(blogs)
    expect(result).toEqual({
      author: "Edsger W. Dijkstra",
      likes: 17
    })
  })

})