import { useSelector, useDispatch } from 'react-redux'


const App = () => {
  const dispatch = useDispatch()
  const store = useSelector(state => state)
  console.log(store)

  return (
    <div>
     
      <button 
        onClick={e => dispatch({ type: 'GOOD' })}
      >
        Good
      </button>
      <button
        onClick={e => dispatch({ type: 'OK' })}
      >
        Ok
      </button>
      <button 
        onClick={e => dispatch({ type: 'BAD' })}
      >
        Bad
      </button>
      <button 
        onClick={e => dispatch({ type: 'ZERO' })}
      >
        Reset stat
      </button>
      <div>
        {Object.entries(store).map(([key,value]) =>
          <div>{key} : {value.toString()}</div>
        )}
      </div>
    </div>
  ) 
}


export default App;