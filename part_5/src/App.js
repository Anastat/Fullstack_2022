import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [newTitle, setNewTitle] = useState('') 
  const [newAuthor, setNewAuthor] = useState('') 
  const [newUrl, setNewUrl] = useState('') 
  const [message, setMessage] = useState(null)
  const [notificationClass, setNotificationClass] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
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

  const handleSetTitle =(event) => {
    setNewTitle(event.target.value)
  }

  const handleSetAuthor =(event) => {
    setNewAuthor(event.target.value)
  }

  const handleSetUrl =(event) => {
    setNewUrl(event.target.value)
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

  const handleAddBlog = async(event) => {
    event.preventDefault()
    const blogToAdd = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

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

    setNewAuthor('')
    setNewTitle('')
    setNewUrl('')
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
            <BlogForm
              handleAddBlog={handleAddBlog}
              handleSetTitle={handleSetTitle}
              handleSetAuthor={handleSetAuthor}
              handleSetUrl={handleSetUrl}
              title={newTitle}
              author={newAuthor}
              url={newUrl}
            />
            {blogs.map(blog =>
              <Blog key={blog.id} blog={blog} />
            )}
          </div>
      }
     
    </div>
  )
}

export default App
