import { createSlice } from '@reduxjs/toolkit'

export const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    latestNotifications: null,
  },
  reducers: {
    addLatestNotification: (state, action) => {
      state.latestNotifications = action.payload
    }
  },
  extraReducers: (builder) => { }
})

export const {
  addLatestNotification
} = notificationSlice.actions

export const selectLatestNotification = (state) => {
  return state.notification.latestNotifications
}

export const notificationReducer = notificationSlice.reducer