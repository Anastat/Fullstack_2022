import { createSlice } from '@reduxjs/toolkit'
import anecdotesService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    addAnecdote(state, action) {
      state.push(action.payload)
    },
    addVoteTo(state, action) {
      const id = action.payload.id
      
      return state.map(anecdote =>
        anecdote.id !== id ? anecdote : action.payload 
      )
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { addAnecdote, addVoteTo, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdotesService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnnecdote = await anecdotesService.addNew(content)
    dispatch(addAnecdote(newAnnecdote))
  }
}

export const updateVotes = (id) => {
  return async (dispatch, getState) => {
    const { anecdotes } = getState()
    
    const anecdoteToChange = anecdotes.find(a => a.id === id)
    const changedAnecdote = { 
      ...anecdoteToChange, 
      votes: anecdoteToChange.votes + 1
    }
    const updatedAnnecdote = await anecdotesService.update(id, changedAnecdote)
    
    dispatch(addVoteTo(updatedAnnecdote))
  }
}

export default anecdoteSlice.reducer