import { useState } from 'react'

const BlogForm = ({addBlog}) => {
  const [newTitle, setNewTitle] = useState('') 
  const [newAuthor, setNewAuthor] = useState('') 
  const [newUrl, setNewUrl] = useState('') 

  const handleSetTitle =(event) => {
    setNewTitle(event.target.value)
  }

  const handleSetAuthor =(event) => {
    setNewAuthor(event.target.value)
  }

  const handleSetUrl =(event) => {
    setNewUrl(event.target.value)
  }

  const handleAddBlog = async(event) => {
    event.preventDefault()
    addBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })

    setNewAuthor('')
    setNewTitle('')
    setNewUrl('')
  }
  
  
  return (
    <>
      <h2>Create new</h2>
      <form onSubmit={handleAddBlog}>
        <div>
          Title:
          <input
            type="text"
            value={newTitle}
            onChange={handleSetTitle}
            placeholder="title of the blog"
          />
        </div>
        <div>
          Author:
          <input
            type="text"
            value={newAuthor}
            onChange={handleSetAuthor}
            placeholder="author of the blog"
          />
        </div>
        <div>
          Url:
          <input
            type="text"
            value={newUrl}
            onChange={handleSetUrl}
            placeholder="add url here"
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </>
   
  )  
}

export default BlogForm