import { useState } from 'react'

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false)

  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <p onClick={toggleVisibility}>{blog.title} <button>view</button></p>
      <div style={showWhenVisible}>
        <button onClick={toggleVisibility}>hide</button>
        <p>{blog.url}</p>
        <p>{blog.likes} <button onClick={() => {}}>like</button></p>
        <p>{blog.author}</p>
      </div>
    </div>
  )
}

export default Blog