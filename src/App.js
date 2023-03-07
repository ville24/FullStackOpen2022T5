import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
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
      setUser(user)
      setUsername('')
      setPassword('')
    }
    catch (exception) {
      console.log('login error:' + exception)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    try {
      window.localStorage.removeItem('loggedBlogappUser')
      setUser(null)
    }
    catch (exception) {
      console.log('logout error:' + exception)
    }
  }

  return (
    <div>
      <h2>blogs</h2>
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