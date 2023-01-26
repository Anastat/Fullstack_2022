import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [notificationClass, setNotificationClass] = useState('')
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs( blogs )
    })  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleSetUsername =(event) => {
    setUsername(event.target.value)
  }

  const handleSetPassword =(event) => {
    setPassword(event.target.value)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })
      setUser(user)
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
    } catch (exception) {
      setMessage('Wrong user name or password!')
      setNotificationClass('error')
      setTimeout(() => {
        setMessage(null)
        setNotificationClass(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  const handleAddBlog = async(blogToAdd) => {

    try {
      const newBlog = await blogService.create(blogToAdd)
      setBlogs(blogs.concat(newBlog))

      setMessage(`A new blog '${newBlog.title}' by ${newBlog.author} added`)
      setNotificationClass('success')
      setTimeout(() => {
        setMessage(null)
        setNotificationClass('')
      }, 5000)
    } catch (exception) {
      setMessage('Failed to add new blog')
      setNotificationClass('error')
      setTimeout(() => {
        setMessage(null)
        setNotificationClass('')
      }, 5000)
    }
  }

  const handleAddLike = async(id) => {
    try {
      const blogToUpdate = blogs.find(blog => blog.id === id)
      const blog = {...blogToUpdate, 
                    likes: blogToUpdate.likes+1,
                    user: blogToUpdate.user.id}
      const updatedBlog = await blogService.update(id, blog)
      setBlogs(blogs.map(blog => blog.id !== id ? blog : updatedBlog))
    } catch (exception) {
      setMessage('Failed to add like')
      setNotificationClass('error')
      setTimeout(() => {
        setMessage(null)
        setNotificationClass('')
      }, 5000)
    }
  }

  const handleDeleteBlog = async(id) => {
    const blog = blogs.find(blog => blog.id === id)
    if (window.confirm(`Delete ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.deleteBlog(id)
        setBlogs(blogs.filter(blog => blog.id !== id))
      } catch (exception) {
        console.log(exception)
        setMessage('Failed to delete blog')
        setNotificationClass('error')
        setTimeout(() => {
          setMessage(null)
          setNotificationClass('')
        }, 5000)
      }
    } 
  }

  const loginForm = () => (
    <>
      <Notification message={message} notificationClass={notificationClass}/>
      <LoginForm
        handleLogin={handleLogin}
        handleSetUsername={handleSetUsername}
        handleSetPassword={handleSetPassword}
        username={username}
        password={password}
      />
    </>
  )

  const blogForm = () => (
    <>
      <Togglable buttonLabel="New blog" ref={blogFormRef}>
        <BlogForm
          addBlog={handleAddBlog}
        />
      </Togglable>
    </>
  )

  return (
    <div>
      {
        user === null
        ? loginForm()
        : <div>
            <h2>blogs</h2>
            <Notification message={message} notificationClass={notificationClass}/>
            <p>{user.name} logged in</p>
            <button onClick={() => handleLogout()}>Log out</button>
            
            {blogForm()}
            <br></br>
            <div>
              {blogs
                .sort((a,b) => b.likes - a.likes)
                .map(blog =>
                  <Blog 
                    key={blog.id} 
                    blog={blog} 
                    userId={user.id}
                    addLike={handleAddLike}
                    deleteBlog={handleDeleteBlog}
                  />
              )}
            </div>
          </div>
      }
     
    </div>
  )
}

export default App
