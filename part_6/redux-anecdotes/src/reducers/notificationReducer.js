import { createSlice } from '@reduxjs/toolkit'


const notificationSlice = createSlice({
  name: 'filter',
  initialState: '',
  reducers: {
    updateNotification(state, action) {
      return action.payload
    },
    removeNotification(state, action) {
      return ''
    } 
  }
    
})

export const { updateNotification, removeNotification } = notificationSlice.actions

export const setNotification = (message, seconds) => {
  return dispatch => {
    const timeout = seconds * 1000;

    dispatch(updateNotification(message))

    setTimeout(() => {
      dispatch(removeNotification())
    }, timeout)
  }
}

export default notificationSlice.reducer