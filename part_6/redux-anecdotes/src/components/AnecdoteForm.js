import { useDispatch } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteReducer'
import anecdotesService from '../services/anecdotes'

const NewAnecdote = () => {
  const dispatch = useDispatch()

  
  const newAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.content.value
    event.target.content.value = ''
    const newAnnecdote = await anecdotesService.addNew(content)
    dispatch(addAnecdote(newAnnecdote))
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={newAnecdote}>
        <div><input name="content"/></div>
        <button type="submit">create</button>
      </form>
    </>
  )
}

export default NewAnecdote