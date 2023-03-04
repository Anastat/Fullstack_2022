import { useMutation, useQueryClient } from 'react-query'
import { addNew } from '../requests'
import { useNotificationDispatch } from '../NotificationContext'

const NewAnecdote = () => {
  const queryClient =  useQueryClient() 
  const dispatch = useNotificationDispatch()

  const newAnecdoteMutation = useMutation(addNew, {
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData('anecdotes')
      queryClient.setQueryData('anecdotes', anecdotes.concat(newAnecdote))

      const message = `anecdote '${newAnecdote.content}' is created`
      dispatch({type: 'ADD', payload: message })

      setTimeout(() => {
        dispatch({type: 'REMOVE'})
      }, 5000)
    },
    onError: () => {
      const message = 'too short anecdote, must have length 5 or more'
      dispatch({type: 'ADD', payload: message })

      setTimeout(() => {
        dispatch({type: 'REMOVE'})
      }, 5000)
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