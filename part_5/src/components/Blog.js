import { useState } from 'react'
import PropTypes from 'prop-types'

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
    return blog.user && blog.user.id === userId
  }

  const buttonText = visible ? 'Hide' : 'View'

  return (
    <div className="blog" style={blogStyle}>
      <div className="blog-name-author">
        {blog.title} {blog.author} 
        <button className='btn-visibility' onClick={toggleVisibility}>{buttonText}</button>
      </div>
      { visible 
        ? <div>
            <div className="blog-url">{blog.url}</div>
            <div className="blog-likes">Likes: {blog.likes}
              <button id="add-like-btn" onClick={() => addLike(blog.id)}>Like</button>
            </div>
            {
              blog.user
              ? <div>{blog.user.name}</div>
              : null
            }
            {
              isUserCreator()
              ? <button id="delete-blog-btn" onClick={() => deleteBlog(blog.id)}>Delete</button>
              : null
            }
          </div>
        : null
      }
      
    </div>  
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired, 
  addLike: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired, 
  userId: PropTypes.string.isRequired
}

export default Blog