import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import { useQuery } from 'react-query' 
import { getAll } from './requests'

const App = () => {
  const result = useQuery('anecdotes', getAll, {
    refetchOnWindowFocus: false,
    retry: 1
  })

  if ( result.isLoading ) {
    return <div>loading data...</div>
  }

  if( result.isError ) {
    return <div>anecdote service not available due to problems in server</div>
  }

  console.log(result)

  const anecdotes = result.data

  return (
    <div>
      <AnecdoteList allAnecdotes={anecdotes}/>
      <AnecdoteForm />
    </div>
  )
}

export default App