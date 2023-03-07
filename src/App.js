import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [notificationMessage, setNotificationMessage] = useState('')

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

  const handleSaveNew = async (event) => {
    event.preventDefault()
    try {
      const result = await blogService.create({
        title: title,
        author: author,
        url: url
      })
      setBlogs(blogs.concat(result))
      setTitle('')
      setAuthor('')
      setUrl('')
      setNotificationMessage(`Blog ${result.title} added`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 2000)
    }
    catch (exception) {
      setErrorMessage(`Saving blog ${title} failed.`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 2000)
    }
  }

  const errorStyle = {
    color: 'red',
    fontSize: 20,
    padding: 5,
    marginBottom: 10,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'red',
    borderRadius: 5,
    backgroundColor: 'lightGray'
  }

  const notificationStyle = {
    color: 'green',
    fontSize: 20,
    padding: 5,
    marginBottom: 10,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'green',
    borderRadius: 5,
    backgroundColor: 'lightGray'
  }

  return (
    <div>
      <h2>blogs</h2>
      {
        errorMessage &&
        <div style={errorStyle}>{errorMessage}</div>
      }
      {
        notificationMessage &&
        <div style={notificationStyle}>{notificationMessage}</div>
      }
      {
        user === null &&
          <div>
            <h2>Log in to application</h2>
            <form onSubmit={handleLogin}>
              <div>
                username
                <input
                  type="text"
                  value={username}
                  name="Username"
                  onChange={({ target }) => setUsername(target.value)}
                />
              </div>
              <div>
                password
                <input
                  type="password"
                  value={password}
                  name="Password"
                  onChange={({ target }) => setPassword(target.value)}
                />
              </div>
              <button type="submit">login</button>
            </form>
          </div>
      }
      {
        user &&
          <>
            <div>{user.name} logged in
              <form onSubmit={handleLogout}>
                <button type="submit">logout</button>
              </form>
            </div>

            <div>
              <h2>create new</h2>
              <form onSubmit={handleSaveNew}>
                <div>
                  title:
                  <input
                    type="text"
                    value={title}
                    name="title"
                    onChange={({ target }) => setTitle(target.value)}
                  />
                </div>
                <div>
                author:
                  <input
                    type="text"
                    value={author}
                    name="author"
                    onChange={({ target }) => setAuthor(target.value)}
                  />
                </div>
                <div>
                url:
                  <input
                    type="text"
                    value={url}
                    name="url"
                    onChange={({ target }) => setUrl(target.value)}
                  />
                </div>
                <button type="submit">create</button>
              </form>
            </div>

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