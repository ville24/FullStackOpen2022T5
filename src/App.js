import { useState, useEffect, useRef } from 'react'
import LoginForm from './components/LoginForm'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import ErrorMessage from './components/ErrorMessage'
import NotificationMessage from './components/NotificationMessage'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [notificationMessage, setNotificationMessage] = useState('')
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNotificationMessage(`Blog ${returnedBlog.title} added`)
        setTimeout(() => {
          setNotificationMessage(null)
        }, 2000)
      })
      .catch(exception => {
        setErrorMessage(`Saving blog ${blogObject.title} failed.`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 2000)
      })
  }

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotificationMessage(`User ${user.name} logged in`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 2000)
    }
    catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 2000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    try {
      window.localStorage.removeItem('loggedBlogappUser')
      setUser(null)
      setNotificationMessage(`User ${user.name} logged out`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 2000)
    }
    catch (exception) {
      setErrorMessage(`User ${user.name} logged failed`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 2000)
    }
  }

  return (
    <div>
      <h2>blogs</h2>
      {
        errorMessage &&
        <ErrorMessage errorMessage={errorMessage}></ErrorMessage>
      }
      {
        notificationMessage &&
        <NotificationMessage notificationMessage={notificationMessage}></NotificationMessage>
      }
      {
        user === null &&
        <LoginForm
          username={username}
          password={password}
          handleLogin={handleLogin}
          handleUsernameChange={handleUsernameChange}
          handlePasswordChange={handlePasswordChange}
        ></LoginForm>
      }
      {
        user &&
          <>
            <div>{user.name} logged in
              <form onSubmit={handleLogout} style={{display: 'inline'}}>
                <button type="submit">logout</button>
              </form>
            </div>
            <Togglable buttonLabel="new blog" ref={blogFormRef}>
              <BlogForm createBlog={addBlog} />
            </Togglable>
            <div>
              {blogs.map(blog =>
                <Blog key={blog.id} blog={blog} />
              )}
            </div>
          </>
      }
    </div>
  )
}

export default App