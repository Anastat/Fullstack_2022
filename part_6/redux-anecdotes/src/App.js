import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Notification from './components/Notification'
import { useQuery } from 'react-query' 
import { getAll } from './requests'
import { useNotificationValue } from './NotificationContext'

const App = () => {
  const notification = useNotificationValue()

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

  const anecdotes = result.data

  return (
    <div>
      {
        notification.length > 0
          ?  <Notification />
          : null
      }
      <AnecdoteForm />
      <AnecdoteList allAnecdotes={anecdotes}/>
    </div>
  )
}

export default App