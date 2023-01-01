const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})
  
  for (let user of helper.initialUsers) {
    userObject = new User(user)
    await userObject.save()
  }
}, 100000)

describe('Creation of a new user test', () => {
  test(' was successful', async () => {
    const newUser = {
      username: "smith",
      name: "John Smith",
      password: "qwerty",
    }  
    await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-type',  /application\/json/)
   
    const users = await api.get('/api/users')
    expect(users.body).toHaveLength(helper.initialUsers.length + 1)

    const username = users.body.map(user => user.username)
    expect(username).toContain('smith')

  }, 100000)

  test('with missing username returns 400 Bad request', async () => {
    const newUser = {
      name: "Matti Luukkainen",
      password: "qwerty",
    }  
    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const users = await helper.usersInDb()
    expect(users).toHaveLength(helper.initialUsers.length)

  }, 100000)

  test('with the same username returns 400 Bad Request', async () => {
    const newUser = {
                      username: "hellas",
                      name: "Leo Promp",
                      password: "qwerty",
                    }
    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    
    expect(response.body.error).toContain('must be unique')
      
    const users = await helper.usersInDb()
    expect(users).toHaveLength(helper.initialUsers.length)

  }, 100000)

  test('with the username and password less than 3 characters length returns 400 Bad Request', async () => {
    const newUser = {
                      username: "he",
                      name: "Leo Promp",
                      password: "qw",
                    }
    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    
    expect(response.body.error).toContain('must be at least 3 characters')
      
    const users = await helper.usersInDb()
    expect(users).toHaveLength(helper.initialUsers.length)

  }, 100000)
})


afterAll(() => {
  mongoose.connection.close()
})