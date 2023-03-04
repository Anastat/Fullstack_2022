import { useMutation, useQueryClient } from 'react-query'
import { addNew } from '../requests'

const NewAnecdote = () => {
  const queryClient =  useQueryClient() 

  const newAnecdoteMutation = useMutation(addNew, {
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData('anecdotes')
      queryClient.setQueryData('anecdotes', anecdotes.concat(newAnecdote))
    }
  })
  
  const newAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.content.value
    event.target.content.value = ''
   
    newAnecdoteMutation.mutate({content, votes: 0 })
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