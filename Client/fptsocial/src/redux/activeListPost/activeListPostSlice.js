import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

// export const getAllPost = createAsyncThunk(
//   'post/getAllPost',
//   async ({ page, pageSize }) => {
//     const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserPost/getpost?Page=${page}&PageSize=${pageSize}`)
//     return response.data?.data
//   }
// )

export const getGroupPostByGroupId = async (id) => {
  const response = await authorizedAxiosInstance
    .get(`${API_ROOT}/api/GroupPost/getGroupPostByGroupId?GroupId=${id}&Page=${1}&PageSize=${10}&Type=${'New'}`)
  return response.data?.data
}
export const getUserPostByUserId = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserPost/getuserpostbyuserid`)
  return response.data?.data
}

export const getOtherUserPost = async (id) => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/UserPost/getotheruserpostbyuserid?OtherUserId=${id}`)
  return response.data?.data
}


const initialState = {
  currentActiveListPost: null,
  totalPage: 0
}

export const activeListPost = createSlice({
  name: 'activeListPost',
  initialState,
  reducers: {
    updateCurrentActiveListPost: (state, action) => {
      state.currentActiveListPost = action.payload
      // state.totalPage = action.payload?.totalPage
    },
    clearCurrentActiveListPost: (state) => {
      state.currentActiveListPost = null
      state.totalPage = 0
    },
    addCurrentActiveListPost: (state, action) => {
      state.currentActiveListPost = [...state.currentActiveListPost || [], ...action.payload?.result || []]
      state.totalPage = action.payload.totalPage
    }
  },
  extraReducers: (builder) => { }
})
export const {
  updateCurrentActiveListPost,
  addCurrentActiveListPost,
  clearCurrentActiveListPost
} = activeListPost.actions

export const selectCurrentActiveListPost = (state) => {
  return state.activeListPost.currentActiveListPost
}
export const selectTotalPage = (state) => {
  return state.activeListPost.totalPage
}
export const activeListPostReducer = activeListPost.reducer