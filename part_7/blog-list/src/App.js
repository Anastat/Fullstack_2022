import { useState, useEffect, useRef } from "react"
import Blog from "./components/Blog"
import BlogForm from "./components/BlogForm"
import LoginForm from "./components/LoginForm"
import Notification from "./components/Notification"
import Togglable from "./components/Togglable"
import blogService from "./services/blogs"
import loginService from "./services/login"
import { useNotificationDispatch } from "./NotificationContext"

const App = () => {
  const dispatch = useNotificationDispatch()
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [notificationClass, setNotificationClass] = useState("")
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      setBlogs(blogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleSetUsername = (event) => {
    setUsername(event.target.value)
  }

  const handleSetPassword = (event) => {
    setPassword(event.target.value)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })
      setUser(user)
      blogService.setToken(user.token)
      setUsername("")
      setPassword("")
      window.localStorage.setItem("loggedUser", JSON.stringify(user))
    } catch (exception) {
      dispatch({ type: "ADD", payload: "Wrong username or password!" })
      setNotificationClass("error")
      setTimeout(() => {
        dispatch({ type: "REMOVE" })
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  const handleAddBlog = async (blogToAdd) => {
    try {
      const newBlog = await blogService.create(blogToAdd)
      // Response contains only user id.
      newBlog.user = { id: user.id, name: user.name }

      setBlogs(blogs.concat(newBlog))

      dispatch({
        type: "ADD",
        payload: `A new blog '${newBlog.title}' by ${newBlog.author} added`,
      })
      setNotificationClass("success")
      setTimeout(() => {
        dispatch({ type: "REMOVE" })
      }, 5000)
    } catch (exception) {
      dispatch({ type: "ADD", payload: "Failed to add new blog" })
      setNotificationClass("error")
      setTimeout(() => {
        dispatch({ type: "REMOVE" })
      }, 5000)
    }
  }

  const handleAddLike = async (id) => {
    try {
      const blogToUpdate = blogs.find((blog) => blog.id === id)
      const blog = {
        ...blogToUpdate,
        likes: blogToUpdate.likes + 1,
        user: blogToUpdate.user.id,
      }
      const updatedBlog = await blogService.update(id, blog)
      setBlogs(blogs.map((blog) => (blog.id !== id ? blog : updatedBlog)))
    } catch (exception) {
      dispatch({ type: "ADD", payload: "Failed to add like" })
      setNotificationClass("error")
      setTimeout(() => {
        dispatch({ type: "REMOVE" })
      }, 5000)
    }
  }

  const handleDeleteBlog = async (id) => {
    const blog = blogs.find((blog) => blog.id === id)
    if (window.confirm(`Delete ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.deleteBlog(id)
        setBlogs(blogs.filter((blog) => blog.id !== id))
      } catch (exception) {
        console.log(exception)
        dispatch({ type: "ADD", payload: "Failed to delete blog" })
        setNotificationClass("error")
        setTimeout(() => {
          dispatch({ type: "REMOVE" })
        }, 5000)
      }
    }
  }

  const loginForm = () => (
    <>
      <Notification notificationClass={notificationClass} />
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
        <BlogForm addBlog={handleAddBlog} />
      </Togglable>
    </>
  )

  return (
    <div>
      {user === null ? (
        loginForm()
      ) : (
        <div>
          <h2>blogs</h2>
          <Notification
            notificationClass={notificationClass}
          />
          <p>{user.name} logged in</p>
          <button id="logout-btn" onClick={() => handleLogout()}>
            Log out
          </button>

          {blogForm()}
          <br></br>
          <div id="blog-list">
            {blogs
              .sort((a, b) => b.likes - a.likes)
              .map((blog) => (
                <Blog
                  key={blog.id}
                  blog={blog}
                  userId={user.id}
                  addLike={handleAddLike}
                  deleteBlog={handleDeleteBlog}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
