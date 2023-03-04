import { useMutation, useQueryClient } from 'react-query'
import { update } from '../requests'

const AnecdoteList = ({allAnecdotes}) => {
  const queryClient = useQueryClient()

  const updateVotesMutation = useMutation(update, {
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData('anecdotes')
      const id = updatedAnecdote.id
      queryClient.setQueryData('anecdotes',
        anecdotes.map(anecdote =>
          anecdote.id !== id ? anecdote : updatedAnecdote
        )
      )
    }
  })

  const vote = (anecdote) => {
    updateVotesMutation.mutate({...anecdote, votes: anecdote.votes + 1})
  }

  return (
    <>
      <h2>Anecdotes</h2>
      
      {allAnecdotes.sort((a, b) => b.votes - a.votes).map(anecdote =>
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