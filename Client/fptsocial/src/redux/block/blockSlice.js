import { createSlice } from '@reduxjs/toolkit'

export const blockSlice = createSlice({
  name: 'block',
  initialState: {
    blockData: null,
    isOpenBlock: false
  },
  reducers: {
    openModalBlock: (state) => {
      state.isOpenBlock = true
    },
    addBlock: (state, action) => {
      state.blockData = action.payload
    },
    clearBlock: (state) => {
      state.blockData = null
      state.isOpenBlock = false
    }
  },
  extraReducers: (builder) => { }
})

export const {
  openModalBlock,
  addBlock,
  clearBlock,
} = blockSlice.actions

export const selectBlockData = (state) => {
  return state.block.blockData
}

export const selectIsOpenBlock = (state) => {
  return state.block.isOpenBlock
}

export const blockReducer = blockSlice.reducer