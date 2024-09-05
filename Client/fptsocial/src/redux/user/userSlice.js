import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

export const getUserByUserId = createAsyncThunk(
  'user/getUserByUserId',
  async () => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserProfile/getuserbyuserid`)
    return response.data?.data
  }
)
export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (data) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/UserProfile/updateprofile`, data)
    return response.data?.data
  }
)

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null
  },
  reducers: {
    logoutCurrentUser: (state, action) => {
      console.log('vao day')
      state.currentUser = null
    },
    addUser: (state, action) => {
      state.currentUser = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getUserByUserId.fulfilled, (state, action) => {
      const user = action.payload
      state.currentUser = user
    })
  }
})

export const { logoutCurrentUser, addUser } = userSlice.actions
export const selectCurrentUser = (state) => {
  return state.user.currentUser
}

export const userReducer = userSlice.reducer