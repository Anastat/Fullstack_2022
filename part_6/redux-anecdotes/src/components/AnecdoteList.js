import { useSelector, useDispatch } from 'react-redux'
import { updateVotes } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'
import Notification from './Notification'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => {
    if(state.filter === '')
      return [...state.anecdotes]
    return state.anecdotes.filter(anecdote => anecdote.content.includes(state.filter))
  })

  const notification = useSelector(state => state.notification)

  const dispatch = useDispatch()

  const vote = (anecdote) => {
    dispatch(updateVotes(anecdote.id))

    dispatch(setNotification(`you voted '${anecdote.content}'`, 10))
  }

  return (
    <>
      <h2>Anecdotes</h2>
      {notification.length > 0 
        ? <Notification />
        : null
      }
      
      {anecdotes.sort((a, b) => b.votes - a.votes).map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote )}>vote</button>
          </div>
        </div>
      )}
    </>
  )
}

export default AnecdoteList