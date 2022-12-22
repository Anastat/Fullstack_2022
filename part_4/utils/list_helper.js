const dummy = (blogs) => {
  return 1;
}

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => total + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if(blogs.length === 0)
    return {}

  const blog = blogs.reduce((prev, cur) => prev.likes > cur.likes ? prev : cur )
  const favorite = {
    title: blog.title,
    author: blog.author,
    likes: blog.likes
  }
  return favorite
}

const mostBlogs = (blogs) => {
  const blogsByAuthor = groupBlogsByAuthor(blogs)

  let authorBlogsCount = []
  Object.entries(blogsByAuthor)
    .forEach(([key, value]) => {
      authorBlogsCount.push({
        author: key,
        blogs: value.length
      })
    })

  return authorBlogsCount.reduce((prev, cur) => prev.blogs > cur.blogs ? prev : cur )
}

const mostLikes = (blogs) => {
  const blogsByAuthor = groupBlogsByAuthor(blogs)

  let authorLikesCount = []
  Object.entries(blogsByAuthor)
    .forEach(([key, value]) => {
      let likes = totalLikes(value)
      authorLikesCount.push({
        author: key,
        likes: likes
      })
    })

  return authorLikesCount.reduce((prev, cur) => prev.likes > cur.likes ? prev : cur )
}

const groupBlogsByAuthor = (blogs) => {
  return blogs.reduce((author, blog) => {
          author[blog.author] = author[blog.author] || []
          author[blog.author].push({
            title: blog.title,
            url: blog.url,
            likes: blog.likes,
          })
          return author
        }, [])
}



module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}