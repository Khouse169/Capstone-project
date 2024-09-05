import { createSlice } from '@reduxjs/toolkit'

export const sideDataSlice = createSlice({
  name: 'sideData',
  initialState: {
    listReactType: null,
    listUserStatus: null
  },
  reducers: {
    addListReactType: (state, action) => {
      state.listReactType = action.payload
    },
    addListUserStatus: (state, action) => {
      state.listUserStatus = action.payload
    }
  },
  extraReducers: (builder) => { }
})

export const {
  addListReactType,
  addListUserStatus
} = sideDataSlice.actions

export const selectListReactType = (state) => {
  return state.sideData.listReactType
}
export const selectListUserStatus = (state) => {
  return state.sideData.listUserStatus
}

export const sideDataReducer = sideDataSlice.reducer