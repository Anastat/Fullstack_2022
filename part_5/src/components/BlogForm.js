const BlogForm = (props) => {
  const {handleAddBlog, handleSetTitle, handleSetAuthor, handleSetUrl, title, author, url} = props
  return (
    <>
      <h2>Create new</h2>
      <form onSubmit={handleAddBlog}>
        <div>
          Title:
          <input
            type="text"
            value={title}
            onChange={handleSetTitle}
          />
        </div>
        <div>
          Author:
          <input
            type="text"
            value={author}
            onChange={handleSetAuthor}
          />
        </div>
        <div>
          Url:
          <input
            type="text"
            value={url}
            onChange={handleSetUrl}
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </>
   
  )  
}

export default BlogForm