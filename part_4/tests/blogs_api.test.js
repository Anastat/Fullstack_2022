const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  
  for (let blog of helper.initialBlogs) {
    blogObject = new Blog(blog)
    await blogObject.save()
  }
}, 100000)

describe('Blogs api get request test', () => {
  
  test('there are blogs in json format', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
  }, 100000)

  test('there are five blogs', async () => {
    const response = await api.get('/api/blogs')
    
    expect(response.body).toHaveLength(helper.initialBlogs.length)
    
  }, 100000)

  test('blogs unique identifier is named id', async () => {
    const response = await api.get('/api/blogs')
   
    const blogIds = response.body.map(blog => blog.id)
    expect(blogIds).toBeDefined()
    
  }, 100000)
})

describe('Blogs api post a new blog test', () => {
  test('creation of a new blog was successful', async () => {
    const newBlog = {
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
    }  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-type',  /application\/json/)
   
    const blogs = await api.get('/api/blogs')
    expect(blogs.body).toHaveLength(helper.initialBlogs.length + 1)

    const blogTitles = blogs.body.map(blog => blog.title)
    expect(blogTitles).toContain('Type wars')

  }, 100000)

  test('creation of a new blog with missing likes has 0', async () => {
    const newBlog = {
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    }  
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-type',  /application\/json/)
   
    expect(response.body.likes).toBe(0)

  }, 100000)

  test('creation of a new blog with missing title or url returns 400 Bad Request', async () => {
    const newBlog = {
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    }  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      
    const blogs = await helper.blogsInDb()

    expect(blogs).toHaveLength(helper.initialBlogs.length)

  }, 100000)
})

describe('Blogs api delete blog test', () => {

  test('delete blog with valid id', async () => {
    const blogs = await helper.blogsInDb()
    const blogToDelete = blogs[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)
    
    const blogsAfterDelete = await helper.blogsInDb()
    expect(blogsAfterDelete).toHaveLength(helper.initialBlogs.length - 1)
    
  }, 100000)

  test('Delete blog with invalid id', async () => {
    await api
      .delete('/api/blogs/1')
      .expect(400)
    
    const blogsAfterDelete = await helper.blogsInDb()
    expect(blogsAfterDelete).toHaveLength(helper.initialBlogs.length)
    
  }, 100000)
})

describe('Blogs api update blog test', () => {

  test('update blog likes to 10  with valid id', async () => {
    const blogs = await helper.blogsInDb()
    const blogToUpdate = blogs[0]

    const updateLikes = {
      likes: 10
    }
    
    const updatedBlog = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updateLikes)
      .expect(200)

    expect(updatedBlog.body.likes).toBe(10)
    
  }, 100000)

  test('update blog likes with invalid id returns 400 Bad request', async () => {
    const updateLikes = {
      likes: 2
    }
    
    await api
      .put(`/api/blogs/1`)
      .send(updateLikes)
      .expect(400)
    
  }, 100000)
})

afterAll(() => {
  mongoose.connection.close()
})