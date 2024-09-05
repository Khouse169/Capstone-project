import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

export const getGroupByGroupId = createAsyncThunk(
  'group/getGroupByGroupId',
  async (id) => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/Group/getgroupbygroupid?GroupId=${id}`)
    return response.data?.data
  }
)

const initialState = {
  currentActiveGroup: null,
}

export const activeGroupSlice = createSlice({
  name: 'activeGroup',
  initialState,
  reducers: {
    clearCurrentGroup: (state) => {
      state.currentActiveGroup = null
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getGroupByGroupId.fulfilled, (state, action) => {
      state.currentActiveGroup = action.payload
    })
  }
})

export const {
  clearCurrentGroup
} = activeGroupSlice.actions

export const selectCurrentActiveGroup = (state) => {
  return state.activeGroup.currentActiveGroup
}
export const activeGroupReducer = activeGroupSlice.reducer