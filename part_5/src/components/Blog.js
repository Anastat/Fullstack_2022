import { useState } from 'react'

const Blog = ({blog, addLike, deleteBlog, userId}) => {
  const [visible, setVisible] = useState(false)

  
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const isUserCreator = () => {
    console.log("i'm here")
    return blog.user && blog.user.id === userId
  }

  const buttonText = visible ? 'Hide' : 'View'

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author} 
        <button onClick={toggleVisibility}>{buttonText}</button>
      </div>
      { visible 
        ? <div>
            <div>{blog.url}</div>
            <div>Likes: {blog.likes}
              <button onClick={() => addLike(blog.id)}>Like</button>
            </div>
            {
              blog.user
              ? <div>{blog.user.name}</div>
              : null
            }
            {
              isUserCreator()
              ? <button onClick={() => deleteBlog(blog.id)}>Delete</button>
              : null
            }
          </div>
        : null
      }
      
    </div>  
  )
}
export default Blog